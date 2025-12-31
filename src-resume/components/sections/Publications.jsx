import React from 'react';
import HighlightText from '../HighlightText';

function Publications({ data, searchQuery }) {
  const articles = data?.journal_articles || [];
  const patents = data?.patents || [];

  if (articles.length === 0 && patents.length === 0) return null;

  return (
    <section className="section">
      <h2 className="section-title">Publications</h2>

      {articles.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Journal Articles</h3>
          {articles.map((pub, idx) => (
            <div key={idx} className="publication-item">
              <div className="pub-title">
                {pub.url ? (
                  <a href={pub.url} target="_blank" rel="noopener noreferrer">
                    <HighlightText text={pub.title} highlight={searchQuery} />
                  </a>
                ) : (
                  <HighlightText text={pub.title} highlight={searchQuery} />
                )}
              </div>
              <div className="pub-authors">
                {pub.authors?.join(', ')}
              </div>
              <div className="pub-venue">
                {pub.journal}
                {pub.volume && `, ${pub.volume}`}
                {pub.number && `(${pub.number})`}
                {pub.pages && `: ${pub.pages}`}
                {pub.year && ` (${pub.year})`}
              </div>
              {pub.note && (
                <div style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#666' }}>
                  {pub.note}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {patents.length > 0 && (
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Patents</h3>
          {patents.map((patent, idx) => (
            <div key={idx} className="publication-item">
              <div className="pub-title">
                {patent.url ? (
                  <a href={patent.url} target="_blank" rel="noopener noreferrer">
                    <HighlightText text={patent.title} highlight={searchQuery} />
                  </a>
                ) : (
                  <HighlightText text={patent.title} highlight={searchQuery} />
                )}
              </div>
              <div className="pub-authors">
                {patent.authors?.join(', ')}
              </div>
              <div className="pub-venue">
                {patent.number} ({patent.year})
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Publications;
