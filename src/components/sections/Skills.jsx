import React from 'react';
import HighlightText from '../HighlightText';

function Skills({ data, searchQuery }) {
  if (!data || Object.keys(data).length === 0) return null;

  const formatCategory = (name) => {
    return name
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  const renderItems = (items) => {
    if (!Array.isArray(items)) return null;

    return (
      <div className="skill-list">
        {items.map((item, idx) => {
          const name = typeof item === 'string' ? item : item.name;

          return (
            <span key={idx} className="skill-item">
              <HighlightText text={name} highlight={searchQuery} />
              {item.proficiency && (
                <span style={{ opacity: 0.7, marginLeft: '0.25rem' }}>
                  ({item.proficiency})
                </span>
              )}
            </span>
          );
        })}
      </div>
    );
  };

  // Order categories for display
  const categoryOrder = [
    'programming_languages',
    'julia_packages',
    'python_packages',
    'optimization_solvers',
    'databases',
    'tools',
    'domains',
    'numerical_methods',
    'soft_skills'
  ];

  const sortedCategories = Object.keys(data).sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a);
    const bIndex = categoryOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <section className="section">
      <h2 className="section-title">Skills</h2>
      {sortedCategories.map(category => (
        <div key={category} className="skill-category">
          <h4>{formatCategory(category)}</h4>
          {renderItems(data[category])}
        </div>
      ))}
    </section>
  );
}

export default Skills;
