import { find } from 'linkifyjs';

export function extractFirstPreviewUrl(text: string): string | null {
  if (!text) return null;

  const urls = find(text, 'url');
  if (urls.length === 0) return null;

  const { value, href } = urls[0];

  // linkifyjs defaults bare `www.foo.com` to `http://www.foo.com`; we want https.
  if (!/^https?:\/\//i.test(value) && href.startsWith('http://')) {
    return `https://${href.slice('http://'.length)}`;
  }

  return href;
}

export function getHostName(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}
