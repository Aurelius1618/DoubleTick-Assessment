import React, { useState, useEffect, useRef, useMemo } from 'react';
import '../styles/table.css';
import CustomerRow from './CustomerRow.jsx';

/**
 * CustomerTable component renders customer data in a scrollable table. It
 * supports lazy loading of rows in batches of 30 and allows sorting by
 * clicking on column headers. The header remains visible when scrolling
 * thanks to CSS position: sticky. Rows change background colour on hover.
 *
 * Props:
 *   - data: array of customer objects to display.
 *   - onSort: callback function invoked with the column key when a header is clicked.
 *   - sortConfig: object describing the current sort { key: string, direction: 'ascending'|'descending' }.
 */
function CustomerTable({ data = [], onSort, sortConfig }) {
  const containerRef = useRef(null);

  /**
   * Renders the sort indicator arrow for a given column key. Returns a small
   * triangle pointing up or down based on the current sort direction.
   * If the column is not actively sorted, nothing is returned.
   *
   * @param {string} key The field key corresponding to a column
   */
  const renderSortIndicator = (key) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div className="customer-table-container" ref={containerRef}>
      <table className="customer-table">
        <thead>
          <tr>
            <th onClick={() => onSort && onSort('avatar')}>Avatar{renderSortIndicator('avatar')}</th>
            <th onClick={() => onSort && onSort('name')}>Name{renderSortIndicator('name')}</th>
            <th onClick={() => onSort && onSort('phone')}>Phone{renderSortIndicator('phone')}</th>
            <th onClick={() => onSort && onSort('email')}>Email{renderSortIndicator('email')}</th>
            <th onClick={() => onSort && onSort('score')}>Score{renderSortIndicator('score')}</th>
            <th onClick={() => onSort && onSort('lastMessageAt')}>Last Message{renderSortIndicator('lastMessageAt')}</th>
            <th onClick={() => onSort && onSort('addedBy')}>Added By{renderSortIndicator('addedBy')}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((customer) => (
            <CustomerRow key={customer.id} customer={customer} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerTable;