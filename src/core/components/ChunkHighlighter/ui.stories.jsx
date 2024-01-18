import React from 'react';
import styled from 'styled-components';
import ChunkHighlighter from '.';
import Linkify from '~/core/components/Linkify';

export default {
  title: 'Ui Only',
};

const highlightNode = styled.span`
  color: ${({ theme }) => theme.palette.primary.main};
  cursor: pointer;
`;

const unhighlightNode = styled(Linkify)`
  display: inline;
`;

export const UiChunkHighlighter = ({ textToHighlight, chunks }) => {
  return (
    <ChunkHighlighter
      textToHighlight={textToHighlight}
      chunks={chunks}
      highlightNode={highlightNode}
      unhighlightNode={unhighlightNode}
    />
  );
};

UiChunkHighlighter.storyName = 'Chunk Highlighter';

UiChunkHighlighter.args = {
  textToHighlight:
    'Hello World @Kaung Myat Lwin @Reza: Please checkout this website: www.amity.co!',
  chunks: [
    {
      start: 12,
      end: 28,
    },
    {
      start: 29,
      end: 34,
    },
  ],
};

UiChunkHighlighter.argTypes = {
  textToHighlight: { control: { type: 'text' } },
  chunks: { control: { type: 'object' } },
};
