import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import FilterControls from '../components/FilterControls';
import Education from '../components/sections/Education';
import Experience from '../components/sections/Experience';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Publications from '../components/sections/Publications';
import Awards from '../components/sections/Awards';
import resumeData from '../data/resume.json';
import { filterByTags, filterBySearch, hasContent } from '../utils/filterUtils';

function Resume() {
  const { data, meta } = resumeData;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTags, setActiveTags] = useState([]);
  const [tagMode, setTagMode] = useState('any');

  const filteredData = useMemo(() => {
    let result = data;
    if (activeTags.length > 0) {
      result = filterByTags(result, activeTags, tagMode);
    }
    if (searchQuery.trim()) {
      result = filterBySearch(result, searchQuery);
    }
    return result;
  }, [data, activeTags, tagMode, searchQuery]);

  const handleTagToggle = (tag) => {
    setActiveTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveTags([]);
  };

  const isFiltering = searchQuery || activeTags.length > 0;
  const hasResults = hasContent(filteredData);

  return (
    <main className="resume-page">
      <Header personal={data.personal} />

      <div className="container">
        <FilterControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          availableTags={meta.availableTags}
          activeTags={activeTags}
          onTagToggle={handleTagToggle}
          tagMode={tagMode}
          onTagModeChange={setTagMode}
          onClear={clearFilters}
        />

        {!hasResults && isFiltering ? (
          <div className="section empty-state">
            <p>No results match your filters.</p>
            <button className="btn-clear" onClick={clearFilters}>Clear Filters</button>
          </div>
        ) : (
          <>
            <Education data={filteredData.education} searchQuery={searchQuery} />
            <Experience data={filteredData.research_experience} searchQuery={searchQuery} />
            <Skills data={filteredData.skills} searchQuery={searchQuery} />
            <Projects data={filteredData.projects} searchQuery={searchQuery} />
            <Publications data={filteredData.publications} searchQuery={searchQuery} />
            <Awards data={filteredData.awards} searchQuery={searchQuery} />
          </>
        )}
      </div>
    </main>
  );
}

export default Resume;
