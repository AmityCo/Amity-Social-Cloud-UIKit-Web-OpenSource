import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Editor from '~/core/components/RichTextEditor';

const TextareaWrapper = styled.div`
  padding-top: 0.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border: none;
`;

const TextContent = ({ id, text, initialMentionees, placeholder, onChange, queryMentionees }) => {
  return (
    <TextareaWrapper>
      <Editor
        id={`update-post-${id}`}
        autoFocus
        data-qa-anchor="post-editor-textarea"
        placeholder={placeholder}
        type="text"
        value={text}
        multiline
        mentionAllowed
        queryMentionees={queryMentionees}
        initialMentionees={initialMentionees}
        onChange={onChange}
      />
    </TextareaWrapper>
  );
};

TextContent.propTypes = {
  text: PropTypes.string,
  placeholder: PropTypes.string,
  queryMentionees: PropTypes.func,
  onChange: PropTypes.func,
};

TextContent.defaultProps = {
  text: '',
  placeholder: '',
  onChange: () => {},
  queryMentionees: () => {},
};

export default TextContent;
