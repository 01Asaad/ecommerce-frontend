import React, { useState } from 'react';
function SortDropdown({ sortCriteria, sortOrder, setSortOrder, setSortCriteria }) {
  const handleCriteriaChange = (event) => {
    setSortCriteria(event.target.value);
  };
  
  const handleOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  return (
    
    <div className="flex justify-end gap-2 mt-4 mx-4">
      <select className="disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer dark:bg-gray-950" value={sortCriteria} onChange={handleCriteriaChange}>
        <option value="createdAt">Date Created</option>
        <option value="price">Price</option>
      </select>
      <select className="disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer dark:bg-gray-950" value={sortOrder} onChange={handleOrderChange} >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}

export default SortDropdown;
