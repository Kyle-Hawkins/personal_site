import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function CodeCell({ content, language = 'javascript' }) {
  return (
    <div className="cell cell-code">
      <div className="code-header">
        <span className="code-language">{language}</span>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 8px 8px',
          fontSize: '0.9rem'
        }}
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeCell;
