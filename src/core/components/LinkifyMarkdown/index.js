import React from 'react';

const MARKDOWN_LINK_REGEX = /\[([^\\[]+)\]\((.*)\)/gm;

const Markdown = ({ children }) => {
  const content = children.replace(MARKDOWN_LINK_REGEX, '<a href="$2">$1</a>');
  return <span dangerouslySetInnerHTML={{ __html: content }} />; // eslint-disable-line react/no-danger
};

export default Markdown;
