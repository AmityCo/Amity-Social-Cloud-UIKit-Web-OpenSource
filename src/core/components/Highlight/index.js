import React from 'react';
import styled from 'styled-components';

export const HighlightedText = styled.span`
  ${({ theme }) => theme.typography.bodyBold}
`;

export const Text = styled.span`
  ${({ theme }) => theme.typography.body}
`;

// from https://stackoverflow.com/questions/29652862/highlight-text-using-reactjs
const Highlight = ({ query, text }) => {
  const chunks = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <div>
      {chunks.map(chunk => {
        if (chunk.toLowerCase() === query.toLowerCase())
          return <HighlightedText key={chunk}>{chunk}</HighlightedText>;
        return <Text key={chunk}>{chunk}</Text>;
      })}
    </div>
  );
};

export default Highlight;
