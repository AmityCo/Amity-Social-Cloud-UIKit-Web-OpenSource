import { extractLinks } from './extractLinks';

describe('extractLinks', () => {
  test('returns empty array for text without URLs', () => {
    expect(extractLinks('')).toEqual([]);
    expect(extractLinks('just some plain text, no links here')).toEqual([]);
  });

  test('extracts a single https URL with correct index and length', () => {
    const text = 'Check this out https://example.com it is cool';
    expect(extractLinks(text)).toEqual([
      {
        index: 15,
        length: 'https://example.com'.length,
        url: 'https://example.com',
        renderPreview: true,
      },
    ]);
  });

  test('extracts multiple URLs from one string', () => {
    const text = 'first https://a.test then https://b.test/path';
    const links = extractLinks(text);

    expect(links).toHaveLength(2);
    expect(links[0].url).toBe('https://a.test');
    expect(links[1].url).toBe('https://b.test/path');
    expect(links.every((l) => l.renderPreview === true)).toBe(true);
  });

  test('extracts www-prefixed and mailto URLs', () => {
    expect(extractLinks('see www.example.com')[0].url).toBe('www.example.com');
    expect(extractLinks('write to mailto:hi@example.com')[0].url).toBe('mailto:hi@example.com');
  });
});
