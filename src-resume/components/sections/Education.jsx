import React, { useState } from 'react';
import HighlightText from '../HighlightText';

function Education({ data, searchQuery }) {
  const [expandedCourses, setExpandedCourses] = useState({});

  if (!data || data.length === 0) return null;

  const toggleCourses = (index) => {
    setExpandedCourses(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <section className="section">
      <h2 className="section-title">Education</h2>
      {data.map((edu, idx) => (
        <div key={idx} className="education-item">
          <div className="edu-header">
            <span className="edu-degree">
              <HighlightText text={edu.degree} highlight={searchQuery} />
            </span>
            <span className="edu-dates">{edu.dates}</span>
          </div>
          <div className="edu-institution">
            {edu.institution}, {edu.location}
            {edu.gpa && ` | GPA: ${edu.gpa}`}
            {edu.honors && ` | ${edu.honors}`}
          </div>
          {edu.thesis && (
            <div className="edu-thesis">
              <strong>Thesis:</strong> <HighlightText text={edu.thesis} highlight={searchQuery} />
            </div>
          )}

          {edu.relevant_coursework && Object.keys(edu.relevant_coursework).length > 0 && (
            <>
              <button
                className="coursework-toggle"
                onClick={() => toggleCourses(idx)}
              >
                {expandedCourses[idx] ? '▼ Hide' : '▶ Show'} Relevant Coursework
              </button>

              {expandedCourses[idx] && (
                <div className="coursework-section">
                  {Object.entries(edu.relevant_coursework).map(([category, courses]) => (
                    <div key={category} className="coursework-category">
                      <h5>{category.replace(/_/g, ' ')}</h5>
                      {courses.map((course, cIdx) => (
                        <div key={cIdx} className="course-item">
                          <span className="course-name">
                            <HighlightText text={course.course} highlight={searchQuery} />
                          </span>
                          {course.grade && ` (${course.grade})`}
                          {course.skills && course.skills.length > 0 && (
                            <div className="course-skills">
                              {course.skills.map((skill, sIdx) => (
                                <span key={sIdx} className="course-skill">
                                  <HighlightText text={skill} highlight={searchQuery} />
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </section>
  );
}

export default Education;
