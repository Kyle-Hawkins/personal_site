import React from 'react';

function YoutubeCell({ videoId, title = 'YouTube video' }) {
  return (
    <div className="cell cell-youtube">
      <div className="youtube-container">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export default YoutubeCell;
