import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import FilterControls from '../components/FilterControls';
import Education from '../components/sections/Education';
import WorkExperience from '../components/sections/WorkExperience';
import Experience from '../components/sections/Experience';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Publications from '../components/sections/Publications';
import Awards from '../components/sections/Awards';
import resumeData from '../data/resume.json';
import { filterBySearch, hasContent } from '../utils/filterUtils';

function Resume() {
  const { data } = resumeData;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    if (searchQuery.trim()) {
      return filterBySearch(data, searchQuery);
    }
    return data;
  }, [data, searchQuery]);

  const clearFilters = () => {
    setSearchQuery('');
  };

  const isFiltering = !!searchQuery;
  const hasResults = hasContent(filteredData);

  return (
    <main className="resume-page">
      <Header personal={data.personal} />

      <div className="container">
        <FilterControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
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
            <WorkExperience data={filteredData.work_experience} searchQuery={searchQuery} />
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
