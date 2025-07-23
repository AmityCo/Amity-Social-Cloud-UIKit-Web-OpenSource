import React from 'react';
import { AutoLinkPlugin as LexicalAutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';

const URL_MATCHER =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const MATCHERS = [
  (text: string) => {
    const match = URL_MATCHER.exec(text);
    if (!match) return null;

    const originalMatch = match[0];
    let truncatedMatch = originalMatch;
    const matchIndex = match.index;

    // If there's a hash fragment but not preceded by "/", truncate it
    const hashIndex = originalMatch.indexOf('#');
    if (hashIndex > 0 && originalMatch[hashIndex - 1] !== '/') {
      truncatedMatch = originalMatch.substring(0, hashIndex);
    }

    // If we truncated completely, don't link anything
    if (truncatedMatch.length === 0) return null;

    return {
      index: matchIndex,
      length: truncatedMatch.length,
      text: truncatedMatch,
      url: truncatedMatch.startsWith('http') ? truncatedMatch : `https://${truncatedMatch}`,
    };
  },
];

export const AutoLinkPlugin = () => <LexicalAutoLinkPlugin matchers={MATCHERS} />;
