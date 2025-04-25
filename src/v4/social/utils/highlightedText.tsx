import React from 'react';
import { Typography } from '~/v4/core/components';

type Part = { type: 'text' | 'dynamic'; value: string };

export function highlightedText(templateText: string, text: string) {
  const pattern = /\{\{\s*(\w+):\s*([^}]+)\s*\}\}/g;
  const parts: Part[] = [];

  let lastIndex = 0;
  let match;

  // Step 1: Break the template into text/userId/communityId parts
  while ((match = pattern.exec(templateText)) !== null) {
    const [fullMatch, _key, value] = match;
    const index = match.index;

    if (index > lastIndex) {
      parts.push({ type: 'text', value: templateText.slice(lastIndex, index) });
    }

    parts.push({ type: 'dynamic', value: value });
    lastIndex = index + fullMatch.length;
  }

  if (lastIndex < templateText.length) {
    parts.push({ type: 'text', value: templateText.slice(lastIndex) });
  }

  // Step 2: Walk through text and extract matching parts
  const output: (string | JSX.Element)[] = [];
  let textPointer = 0;

  parts.forEach((part, i) => {
    if (part.type === 'text') {
      const nextIndex = text.indexOf(part.value, textPointer);
      if (nextIndex !== -1) {
        const inBetween = text.slice(textPointer, nextIndex);
        if (inBetween) output.push(inBetween);
        output.push(part.value);
        textPointer = nextIndex + part.value.length;
      }
    } else {
      // dynamic part
      const nextStatic = parts.slice(i + 1).find((p) => p.type === 'text')?.value;
      let endIndex = nextStatic ? text.indexOf(nextStatic, textPointer) : text.length;

      if (endIndex === -1) endIndex = text.length;

      const dynamicText = text.slice(textPointer, endIndex);
      if (dynamicText) {
        output.push(
          <Typography.BodyBold as="span" key={textPointer}>
            {dynamicText}
          </Typography.BodyBold>,
        );
      }
      textPointer = endIndex;
    }
  });

  // Final leftovers
  if (textPointer < text.length) {
    output.push(text.slice(textPointer));
  }

  return output;
}
