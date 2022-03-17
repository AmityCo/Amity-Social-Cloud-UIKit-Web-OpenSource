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

import React, { createElement, isValidElement } from 'react';
import PropTypes from 'prop-types';

const renderNodes = (parentNode, props) => {
  if (isValidElement(parentNode) || typeof parentNode === 'object') {
    const Node = parentNode;

    return <Node {...props} />;
  }

  return createElement(parentNode ?? 'span', props);
};

const processChunks = (text, chunks = []) => {
  const textLength = text.length;
  const allChunks = [];

  const append = (start, end, highlight) => {
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

const ChunkHighlighter = ({ textToHighlight, chunks, highlightNode, unhighlightNode }) => {
  let highlightIndex = -1;

  const combinedChunks = processChunks(textToHighlight, chunks);

  return createElement('span', {
    children: combinedChunks.map(({ highlight, start, end }) => {
      const text = textToHighlight.substring(start, end);

      if (highlight) {
        highlightIndex += 1;
        return renderNodes(highlightNode, { children: text, highlightIndex });
      }

      return renderNodes(unhighlightNode, { children: text });
    }),
  });
};

ChunkHighlighter.propTypes = {
  textToHighlight: PropTypes.string.isRequired,
  chunks: PropTypes.array,
  highlightNode: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.object,
    PropTypes.string,
    PropTypes.func,
  ]),
  unhighlightNode: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.object,
    PropTypes.string,
    PropTypes.func,
  ]),
};

export default ChunkHighlighter;
