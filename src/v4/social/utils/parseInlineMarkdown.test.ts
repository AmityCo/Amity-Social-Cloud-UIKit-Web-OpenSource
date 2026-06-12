import { parseInlineMarkdown, stripMarkdownLinkUrls } from './parseInlineMarkdown';

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

describe('stripMarkdownLinkUrls', () => {
  const link = (text: string, url: string): Amity.Link => ({
    index: text.indexOf(url),
    length: url.length,
    url,
    renderPreview: true,
  });

  test('returns links untouched when the text has no markdown links', () => {
    const text = 'plain https://example.com';
    const links = [link(text, 'https://example.com')];
    expect(stripMarkdownLinkUrls(links, text)).toBe(links);
  });

  test('drops a link pointing at the url of a markdown link', () => {
    const url = 'https://dev.meetperry.com/members/123';
    const text = `[please meet Richard.](${url})`;
    expect(stripMarkdownLinkUrls([link(text, url)], text)).toEqual([]);
  });

  test('keeps bare urls and drops only markdown link targets', () => {
    const text = 'see https://example.com and [docs](https://docs.example.com/x)';
    const links = [link(text, 'https://example.com'), link(text, 'https://docs.example.com/x')];
    const result = stripMarkdownLinkUrls(links, text);
    expect(result.map((l) => l.url)).toEqual(['https://example.com']);
  });

  test('drops targets of multiple markdown links', () => {
    const text = 'a [one](https://a.test) then b [two](https://b.test/x)';
    const links = [link(text, 'https://a.test'), link(text, 'https://b.test/x')];
    expect(stripMarkdownLinkUrls(links, text)).toEqual([]);
  });

  test('drops a link detected inside the markdown label too', () => {
    const text = '[www.example.com](https://example.com/ref)';
    const links = [link(text, 'www.example.com'), link(text, 'https://example.com/ref')];
    expect(stripMarkdownLinkUrls(links, text)).toEqual([]);
  });
});
