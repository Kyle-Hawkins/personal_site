import React from 'react';

function FilterControls({
  searchQuery,
  onSearchChange,
  onClear
}) {
  const hasFilters = !!searchQuery;

  return (
    <div className="filter-controls">
      <div className="filter-row">
        <input
          type="text"
          className="search-input"
          placeholder="Search skills, projects, courses..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {hasFilters && (
          <button className="btn-clear" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default FilterControls;
