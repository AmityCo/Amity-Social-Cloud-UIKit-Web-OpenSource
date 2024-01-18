import React from 'react';
import styled from 'styled-components';

export const Text = styled.span<{ highlight?: boolean }>`
  ${({ theme, highlight }) => (highlight ? theme.typography.bodyBold : theme.typography.body)}
`;

interface HighlightProps {
  text: string;
  query?: string;
}

// from https://stackoverflow.com/questions/29652862/highlight-text-using-reactjs
const Highlight = ({ query, text }: HighlightProps) => {
  // no query, no need.
  if (query == null || query?.length === 0) return <Text>{text}</Text>;

  const chunks = text.split(new RegExp(`(${query})`, 'gi'));

  return (
    <span>
      {chunks.map((chunk, index) => (
        <Text key={`#${chunk}#${index}`} highlight={chunk.toLowerCase() === query.toLowerCase()}>
          {chunk}
        </Text>
      ))}
    </span>
  );
};

export default Highlight;
