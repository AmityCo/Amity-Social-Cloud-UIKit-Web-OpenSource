import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import InputText from '~/core/components/InputText';

const TextareaWrapper = styled.div`
  padding-top: 0.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border: none;
`;

const Textarea = styled(InputText).attrs({ rows: 1, maxRows: 15 })`
  outline: none;
  border: none;
  resize: none;
  font: inherit;
`;

const TextContent = ({ text, placeholder, onChange, queryMentionees }) => {
  return (
    <TextareaWrapper>
      <Textarea
        placeholder={placeholder}
        type="text"
        value={text}
        multiline
        mentionAllowed
        queryMentionees={queryMentionees}
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
