import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const Text = styled.span`
  ${({ theme, highlight }) => (highlight ? theme.typography.bodyBold : theme.typography.body)}
`;

// from https://stackoverflow.com/questions/29652862/highlight-text-using-reactjs
const Highlight = ({ query, text }) => {
  // no query, no need.
  if (!query.length) return <Text>{text}</Text>;

  const chunks = text.split(new RegExp(`(${query})`, 'gi'));

  return (
    <span>
      {chunks.map((chunk, index) => (
        <Text key={`#${chunk}#${index}`} highlight={chunk?.toLowerCase() === query?.toLowerCase()}>
          {chunk}
        </Text>
      ))}
    </span>
  );
};

Highlight.propTypes = {
  text: PropTypes.string.isRequired,
  query: PropTypes.string,
};

Highlight.defaultProps = {
  query: '',
};

export default Highlight;
