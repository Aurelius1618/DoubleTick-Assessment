import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { generateCustomers } from './utils/generateCustomers.js';
import CustomerTable from './components/CustomerTable.jsx';
import useInfiniteScroll from './utils/useInfiniteScroll.js';

/**
 * The root component of the application. As this project grows you can
 * compose additional components from the `src/components` folder here.
 */
function App() {
  // Generate one hundred thousand customer records on initial render. The function is
  // provided as a lazy initializer to avoid generating data on every re-render.
  // Generate one hundred thousand customer records instead of one hundred thousand.
  // Reducing the size makes the initial data generation and sorting far
  // less taxing on the browser, especially during development. You can
  // adjust this number as needed (e.g. increase for performance testing).
  const [customers] = useState(() => generateCustomers(100000));
  // Search input state and debounced value
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  // Visible row count for infinite scroll
  const [visible, setVisible] = useState(30);
  // Sorting configuration. Default sort by name ascending.
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // Debounce the search input by 250ms to avoid filtering on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setVisible(30); // reset visible rows when search term changes
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Filter the customers based on the debounced search term (name, email, phone).
  const filteredCustomers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return customers;
    return customers.filter((c) => {
      return (
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.toLowerCase().includes(query)
      );
    });
  }, [customers, searchTerm]);

  // Sort the filtered customers based on the current sort configuration.
  const sortedCustomers = useMemo(() => {
    const { key, direction } = sortConfig;
    // Copy array before sorting to avoid mutating original data
    const arr = [...filteredCustomers];
    return arr.sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];
      // Convert for date sorting
      if (key === 'lastMessageAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      // Determine comparison
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      } else if (aVal instanceof Date && bVal instanceof Date) {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      } else {
        // Compare strings with localeCompare for case-insensitive sorting
        const comp = String(aVal).localeCompare(String(bVal), undefined, { sensitivity: 'base' });
        return direction === 'asc' ? comp : -comp;
      }
    });
  }, [filteredCustomers, sortConfig]);

  // Slice the sorted customers array to only render the currently visible rows.
  const visibleCustomers = useMemo(() => {
    return sortedCustomers.slice(0, visible);
  }, [sortedCustomers, visible]);

  // Infinite scroll: load more rows when user scrolls near bottom
  const loadMore = useCallback(() => {
    setVisible((prev) => Math.min(prev + 30, sortedCustomers.length));
  }, [sortedCustomers.length]);
  useInfiniteScroll(loadMore);

  // Ensure there is enough content to allow scrolling. If the current page
  // height is less than the viewport height and more data is available,
  // automatically load the next batch. Without this check, only the first
  // 30 rows may render and scrolling never triggers the infinite scroll
  // listener because the document doesn't exceed the viewport height.
  useEffect(() => {
    // Only attempt auto-loading if there are more customers to show
    if (visibleCustomers.length < sortedCustomers.length) {
      // Check if the document height is shorter than the viewport
      const checkAndLoad = () => {
        const docHeight = document.documentElement.scrollHeight;
        const viewportHeight = window.innerHeight;
        if (docHeight <= viewportHeight) {
          loadMore();
        }
      };
      // Run after a small delay to allow React to update the DOM
      const id = setTimeout(checkAndLoad, 50);
      return () => clearTimeout(id);
    }
  }, [visibleCustomers.length, sortedCustomers.length, loadMore]);

  // Handle column sort toggling
  const handleSort = useCallback((columnKey) => {
    setSortConfig((prev) => {
      if (prev && prev.key === columnKey) {
        return {
          key: columnKey,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key: columnKey, direction: 'asc' };
    });
  }, []);

  // Filters dropdown state and outside click handling
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="app-container">
      <h1>Welcome to Doubletick Assessment</h1>
      {/* Search and filters controls */}
      <div className="controls" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search by name, email or phone"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ padding: '0.5rem', flexGrow: 1, minWidth: 0 }}
        />
        <div className="filters-wrapper" ref={filtersRef} style={{ position: 'relative' }}>
          <button type="button" onClick={() => setFiltersOpen((prev) => !prev)} style={{ padding: '0.5rem 1rem' }}>
            Filters
          </button>
          {filtersOpen && (
            <div
              className="filters-dropdown"
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: '#fff',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                zIndex: 10,
                padding: '0.5rem',
                minWidth: '160px',
              }}
            >
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                <li style={{ padding: '0.5rem 0', cursor: 'pointer' }}>High Score (&gt;80)</li>
                <li style={{ padding: '0.5rem 0', cursor: 'pointer' }}>Recent Messages</li>
                <li style={{ padding: '0.5rem 0', cursor: 'pointer' }}>Added by Admin</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Table and info */}
      <p style={{ marginBottom: '0.5rem' }}>Showing {visibleCustomers.length.toLocaleString()} of {sortedCustomers.length.toLocaleString()} results</p>
      <CustomerTable data={visibleCustomers} onSort={handleSort} sortConfig={sortConfig} />
    </div>
  );
}

export default App;