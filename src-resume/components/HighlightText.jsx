import React from 'react';

function HighlightText({ text, highlight }) {
  if (!highlight || !text) return <>{text}</>;

  const query = highlight.toLowerCase();
  const index = text.toLowerCase().indexOf(query);

  if (index === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, index)}
      <span className="highlight">{text.slice(index, index + query.length)}</span>
      {text.slice(index + query.length)}
    </>
  );
}

export default HighlightText;
