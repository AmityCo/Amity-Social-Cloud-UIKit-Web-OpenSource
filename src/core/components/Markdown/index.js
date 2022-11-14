import React from 'react';
import ReactMarkdown from 'react-markdown';

const Markdown = ({ children }) => {
  return <ReactMarkdown>{children}</ReactMarkdown>;
};

export default Markdown;
