/**
 * Filter resume data by search query
 */
export function filterBySearch(data, query) {
  const q = query.toLowerCase().trim();
  if (!q) return data;

  const textMatch = (text) => text?.toLowerCase().includes(q);
  const arrayMatch = (arr) => arr?.some(item =>
    typeof item === 'string' ? textMatch(item) : textMatch(item.name)
  );

  return {
    ...data,
    education: filterEducationBySearch(data.education, q, textMatch),
    work_experience: data.work_experience?.filter(exp =>
      textMatch(exp.title) ||
      textMatch(exp.organization) ||
      textMatch(exp.location) ||
      exp.bullets?.some(b => textMatch(b))
    ),
    research_experience: data.research_experience?.map(exp => ({
      ...exp,
      projects: exp.projects?.filter(proj =>
        textMatch(proj.name) || textMatch(proj.description)
      )
    })).filter(exp => exp.projects?.length > 0),
    skills: filterSkillsBySearch(data.skills, textMatch),
    projects: data.projects?.filter(proj =>
      textMatch(proj.name) ||
      textMatch(proj.description) ||
      arrayMatch(proj.technologies)
    ),
    publications: {
      journal_articles: data.publications?.journal_articles?.filter(p =>
        textMatch(p.title) || p.authors?.some(a => textMatch(a))
      ),
      patents: data.publications?.patents?.filter(p =>
        textMatch(p.title) || p.authors?.some(a => textMatch(a))
      )
    },
    awards: {
      grants: data.awards?.grants?.filter(a =>
        textMatch(a.name) || textMatch(a.description)
      ),
      honors: data.awards?.honors?.filter(a =>
        textMatch(a.name) || textMatch(a.description)
      )
    },
    volunteer: data.volunteer?.filter(v =>
      textMatch(v.title) || textMatch(v.organization) || textMatch(v.project)
    )
  };
}

function filterEducationBySearch(education, q, textMatch) {
  if (!education) return education;

  return education.map(edu => {
    const matchesDegree = textMatch(edu.degree) ||
                          textMatch(edu.institution) ||
                          textMatch(edu.thesis);

    // Filter coursework
    let filteredCoursework = null;
    if (edu.relevant_coursework) {
      filteredCoursework = {};
      for (const [cat, courses] of Object.entries(edu.relevant_coursework)) {
        const filtered = courses.filter(c =>
          textMatch(c.course) ||
          textMatch(c.description) ||
          c.skills?.some(s => textMatch(s))
        );
        if (filtered.length > 0) filteredCoursework[cat] = filtered;
      }
      if (Object.keys(filteredCoursework).length === 0) filteredCoursework = null;
    }

    if (matchesDegree || filteredCoursework) {
      return { ...edu, relevant_coursework: filteredCoursework || edu.relevant_coursework };
    }
    return null;
  }).filter(Boolean);
}

function filterSkillsBySearch(skills, textMatch) {
  if (!skills) return skills;

  const result = {};
  for (const [category, items] of Object.entries(skills)) {
    if (Array.isArray(items)) {
      const filtered = items.filter(item =>
        typeof item === 'string' ? textMatch(item) : textMatch(item.name)
      );
      if (filtered.length > 0) result[category] = filtered;
    }
  }
  return result;
}

/**
 * Check if data has any content after filtering
 */
export function hasContent(data) {
  if (!data) return false;

  const hasEducation = data.education?.length > 0;
  const hasWorkExperience = data.work_experience?.length > 0;
  const hasExperience = data.research_experience?.some(e => e.projects?.length > 0);
  const hasSkills = data.skills && Object.keys(data.skills).length > 0;
  const hasProjects = data.projects?.length > 0;
  const hasPubs = data.publications?.journal_articles?.length > 0 ||
                  data.publications?.patents?.length > 0;
  const hasAwards = data.awards?.grants?.length > 0 ||
                    data.awards?.honors?.length > 0;

  return hasEducation || hasWorkExperience || hasExperience || hasSkills || hasProjects || hasPubs || hasAwards;
}
