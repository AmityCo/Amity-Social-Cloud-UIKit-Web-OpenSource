import { parseInlineMarkdown } from './parseInlineMarkdown';

describe('parseInlineMarkdown', () => {
  test('returns empty array for empty input', () => {
    expect(parseInlineMarkdown('')).toEqual([]);
  });

  test('returns a single text segment when there is no markdown', () => {
    expect(parseInlineMarkdown('just some plain text')).toEqual([
      { type: 'text', text: 'just some plain text' },
    ]);
  });

  test('extracts bold, italic, and link from a mixed string', () => {
    expect(
      parseInlineMarkdown(
        'This is **bold**, this is *italic*, and this is a [label](https://example.com).',
      ),
    ).toEqual([
      { type: 'text', text: 'This is ' },
      { type: 'bold', text: 'bold' },
      { type: 'text', text: ', this is ' },
      { type: 'italic', text: 'italic' },
      { type: 'text', text: ', and this is a ' },
      { type: 'link', label: 'label', url: 'https://example.com' },
      { type: 'text', text: '.' },
    ]);
  });

  test('prefers bold over italic when both could match (**a**)', () => {
    expect(parseInlineMarkdown('**a**')).toEqual([{ type: 'bold', text: 'a' }]);
  });

  test('leaves unmatched markers as literal text', () => {
    expect(parseInlineMarkdown('one * two ** three')).toEqual([
      { type: 'text', text: 'one * two ** three' },
    ]);
  });
});
