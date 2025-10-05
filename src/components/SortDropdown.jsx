import React, { useState } from 'react';
// import SelectMenuWithAvatar from './UI/SelectMenuWithAvatar';
function SortDropdown({ filters, setFilters }) {
  const handleCriteriaChange = (event) => {
    setFilters(prev => {
      return {
        ...prev, sortCriteria: event.target.value
      }
    })
  };

  const handleOrderChange = (event) => {
    setFilters(prev => {
      return {
        ...prev, sortOrder: event.target.value
      }
    })
  };

  function keywordChangeHandler(e) {
    setFilters(prev => {
      return {
        ...prev, keyword: e.target.value
      }
    })
  }
  function exactMatchCheckHandler(e) {
    console.log("setting to " + e.target.checked);
    
    setFilters(prev => {
      return {
        ...prev, exactMatch: e.target.checked
      }
    })
  }
  return (
    <div className='flex justify-between'>
      <div className='flex justify-start mb-2 mt-4 mx-4 space-x-2'>
        <input className='w-xl outline-1 dark:outline-0 dark:bg-gray-800 p-2 rounded-sm' placeholder='product name' onChange={keywordChangeHandler} value={filters.keyword}></input>
        <div className='flex items-center border-1 border-gray-600 px-2 rounded-sm'>
          <input className='w-7 h-5  bg-gray-800 rounded-sm' onChange={exactMatchCheckHandler} type='checkbox' id="exactMatch"></input>
          <label for="exactMatch">Exact match</label>
        </div>

      </div>
      {/* <div>
        <SelectMenuWithAvatar choices={people} selected={people[0]} setSelected={() => {}}></SelectMenuWithAvatar>
      </div> */}
      <div className="flex justify-end gap-2 mt-4 mx-4">
        <select className="disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer dark:bg-gray-950" value={filters.sortCriteria} onChange={handleCriteriaChange}>
          <option value="createdAt">Date Created</option>
          <option value="price">Price</option>
        </select>
        <select className="disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer dark:bg-gray-950" value={filters.sortOrder} onChange={handleOrderChange} >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}

export default SortDropdown;
