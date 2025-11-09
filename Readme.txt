# DoubleTick-Assessment

# **Summary**

Implement a **Customers List UI** that can handle **1 million records** with infinite scroll, search, and sorting. Filters are dummy (non-functional).

---

## **Requirements**

- Generate **1M records** locally (id, name, phone, email, score, lastMessageAt, addedBy, avatar).
- Display in a **table view** (as per screenshot).
- **30 rows per page**, load more on scroll.
- **Search** (name/email/phone, debounced 250ms).
- **Sort** (click column header → asc/desc).
- **Filters dropdown** (static only, no logic).
- Sticky header + row hover.

## **Technical Notes**

- **React + Vite** (Node 22+, ESM).
- **Plain CSS only** (no Tailwind/Bootstrap).
- Data stored in memory or IndexedDB.
- Keep smooth scrolling (no UI freeze).

## **Deliverables**

- Working React app with above functionality.
- Clean, commented code.

## **Acceptance Criteria**

- Can scroll through all **1M rows** smoothly.
- Search works with partial matches.
- Sorting toggles asc/desc correctly.
- Header stays sticky.
- Dummy filters dropdown opens (no functionality).
- No major performance issues.
