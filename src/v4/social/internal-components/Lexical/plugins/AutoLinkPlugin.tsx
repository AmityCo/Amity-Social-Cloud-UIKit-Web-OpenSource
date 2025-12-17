import React from 'react';
import { AutoLinkPlugin as LexicalAutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';

const URL_MATCHER =
  /(?:(?:https?|ftp):\/\/(?:[a-zA-Z0-9.-]+|[\d.]+)(?::\d{1,5})?(?:\/[^\s<>|]*)?|mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|www\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s<>|]*)?)/;

const MATCHERS = [
  (text: string) => {
    const match = URL_MATCHER.exec(text);
    if (!match) return null;

    const originalMatch = match[0];
    const matchIndex = match.index;

    return {
      index: matchIndex,
      length: originalMatch.length,
      text: originalMatch,
      url:
        originalMatch.startsWith('http') ||
        originalMatch.startsWith('ftp') ||
        originalMatch.startsWith('mailto')
          ? originalMatch
          : `https://${originalMatch}`,
    };
  },
];

export const AutoLinkPlugin = () => <LexicalAutoLinkPlugin matchers={MATCHERS} />;
