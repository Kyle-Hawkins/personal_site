import React from 'react';

function ImageCell({ src, caption, alt }) {
  return (
    <div className="cell cell-image">
      <figure>
        <img src={src} alt={alt || caption || 'Project image'} />
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
    </div>
  );
}

export default ImageCell;
