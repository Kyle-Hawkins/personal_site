import React from 'react';

function FilterControls({
  searchQuery,
  onSearchChange,
  availableTags,
  activeTags,
  onTagToggle,
  tagMode,
  onTagModeChange,
  onClear
}) {
  const hasFilters = searchQuery || activeTags.length > 0;

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
            Clear Filters
          </button>
        )}
      </div>

      <div className="filter-row">
        <span className="filter-label">Filter by focus:</span>
        <div className="tag-filters">
          {availableTags.map(tag => (
            <button
              key={tag}
              className={`tag-btn ${activeTags.includes(tag) ? 'active' : ''}`}
              onClick={() => onTagToggle(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        {activeTags.length > 1 && (
          <select
            value={tagMode}
            onChange={(e) => onTagModeChange(e.target.value)}
            className="tag-mode-select"
          >
            <option value="any">Match ANY</option>
            <option value="all">Match ALL</option>
          </select>
        )}
      </div>

      {hasFilters && (
        <div className="active-filters">
          <span>Active: </span>
          {activeTags.map(tag => (
            <span key={tag} className="active-tag" onClick={() => onTagToggle(tag)}>
              {tag} ×
            </span>
          ))}
          {searchQuery && (
            <span className="active-tag" onClick={() => onSearchChange('')}>
              "{searchQuery}" ×
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default FilterControls;
