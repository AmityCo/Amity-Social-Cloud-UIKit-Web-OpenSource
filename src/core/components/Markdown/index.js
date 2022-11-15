import React, { useEffect, useState } from 'react';
import { remark } from 'remark';
import html from 'remark-html';

const renderMarkdown = (markdown) => {
  return remark()
    .use(html, {
      sanitize: {
        // List allowed HTML elements to render:
        tagNames: ['a', 'p'],
      },
    })
    .process(markdown);
};

const useMarkdown = (markdown = '') => {
  const [content, setContent] = useState('');

  useEffect(() => {
    renderMarkdown(markdown).then((result) => {
      setContent(result.toString());
    });
  }, [markdown]);

  return content;
};

const Markdown = ({ children }) => {
  const content = useMarkdown(children);
  return <span dangerouslySetInnerHTML={{ __html: content }} />; // eslint-disable-line react/no-danger
};

export default Markdown;
