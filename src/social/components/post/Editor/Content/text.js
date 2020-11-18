import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';

const TextareaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border: none;
  padding-bottom: 16px;
`;

const Textarea = styled(TextareaAutosize).attrs({ rows: 1, maxRows: 15 })`
  padding: 0;
  outline: none;
  border: none;
  border-radius: 4px;
  resize: none;
  font: inherit;
`;

const TextContent = ({ text, placeholder, onChangeText }) => {
  return (
    <TextareaWrapper>
      <Textarea
        placeholder={placeholder}
        type="text"
        value={text}
        onChange={e => onChangeText(e.target.value)}
      />
    </TextareaWrapper>
  );
};

TextContent.propTypes = {
  text: PropTypes.string,
  placeholder: PropTypes.string,
  onChangeText: PropTypes.func,
};

TextContent.defaultProps = {
  text: '',
  placeholder: '',
  onChangeText: () => {},
};

export default TextContent;
