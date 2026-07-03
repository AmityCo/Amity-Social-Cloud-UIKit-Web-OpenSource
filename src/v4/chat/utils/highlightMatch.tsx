import type { ReactNode } from 'react';
import { SEARCH_MIN_QUERY_LENGTH } from '~/v4/chat/constants';

export function highlightMatch(text: string, query: string, highlightClassName: string): ReactNode {
  if (text.length === 0) return text;
  const trimmed = query.trim();
  if (trimmed.length < SEARCH_MIN_QUERY_LENGTH) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = trimmed.toLowerCase();

  const parts: ReactNode[] = [];
  let cursor = 0;
  let matchAt = lowerText.indexOf(lowerQuery, cursor);

  while (matchAt !== -1) {
    if (matchAt > cursor) {
      parts.push(text.slice(cursor, matchAt));
    }
    parts.push(
      <span key={`m-${matchAt}`} className={highlightClassName}>
        {text.slice(matchAt, matchAt + trimmed.length)}
      </span>,
    );
    cursor = matchAt + trimmed.length;
    matchAt = lowerText.indexOf(lowerQuery, cursor);
  }

  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts.length > 0 ? parts : text;
}
