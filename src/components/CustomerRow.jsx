import React from 'react';

/**
 * Presentational component for rendering a single customer's row. Wrapped in
 * React.memo to prevent unnecessary re-renders when props don't change.
 *
 * @param {Object} props
 * @param {Object} props.customer The customer record to render.
 */
function CustomerRow({ customer }) {
  return (
    <tr>
      <td>
        <img
          src={customer.avatar}
          alt={customer.name}
          className="avatar"
          width={32}
          height={32}
        />
      </td>
      <td>{customer.name}</td>
      <td>{customer.phone}</td>
      <td>{customer.email}</td>
      <td>{customer.score}</td>
      <td>{new Date(customer.lastMessageAt).toLocaleDateString()}</td>
      <td>{customer.addedBy}</td>
    </tr>
  );
}

export default React.memo(CustomerRow);