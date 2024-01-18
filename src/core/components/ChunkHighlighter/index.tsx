/*
  Very minimal Highlight UI Component

  Reasons why:
  react-highlight-words have unnecessary highlights and the
  unpacked size was ~3.8 MB-ish which was pretty big.
  The internal of the library also uses String.substr() which
  is no longer supported from MDN
  (see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr)

  This component "borrows" design from react-highlight-words lib
  but only uses the {start, end} chunks of a string and injects
  the desired Nodes inside <span> Node for rendering.
*/

import React, { ReactNode } from 'react';

type Chunk = { start: number; end: number; highlight?: boolean };

export const processChunks = (text: string, chunks: Chunk[] = []) => {
  const textLength = text.length;
  const allChunks: Chunk[] = [];

  const append = (start: number, end: number, highlight: boolean) => {
    allChunks.push({ start, end, highlight });
  };

  if (chunks.length === 0) {
    append(0, textLength, false);
  } else {
    let lastIndex = 0;
    chunks.forEach((chunk) => {
      append(lastIndex, chunk.start, false);
      append(chunk.start, chunk.end, true);
      lastIndex = chunk.end;
    });
    append(lastIndex, textLength, false);
  }

  return allChunks;
};

interface ChunkHighlighterProps {
  textToHighlight: string;
  chunks?: Chunk[];
  renderHighlightNode?: (props: {
    key: string;
    start: number;
    end: number;
    text: string;
  }) => ReactNode;
  renderUnhighlightNode?: (props: {
    key: string;
    start: number;
    end: number;
    text: string;
  }) => ReactNode;
}

const ChunkHighlighter = ({
  textToHighlight,
  chunks,
  renderHighlightNode,
  renderUnhighlightNode,
}: ChunkHighlighterProps) => {
  let highlightIndex = -1;

  const combinedChunks = processChunks(textToHighlight, chunks);

  return (
    <span>
      {combinedChunks.map(({ highlight, start, end }) => {
        const text = textToHighlight.substring(start, end);

        if (highlight) {
          highlightIndex += 1;
          if (renderHighlightNode) {
            return renderHighlightNode({ key: `${text}-${start}-${end}`, start, end, text });
          }

          return <span key={`${start}-${end}`}>{text}</span>;
        }

        if (renderUnhighlightNode) {
          return renderUnhighlightNode({ key: `${text}-${start}-${end}`, start, end, text });
        }
        return <span key={`${start}-${end}`}>{text}</span>;
      })}
    </span>
  );
};

export default ChunkHighlighter;
