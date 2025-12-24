import { AutoLinkPlugin as LexicalAutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';
import { URL_REGEX } from '~/v4/social/constants/post';

const MATCHERS = [
  (text: string) => {
    const match = URL_REGEX.exec(text);
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
