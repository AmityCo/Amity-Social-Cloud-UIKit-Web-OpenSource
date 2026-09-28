import { Client } from '@amityco/ts-sdk';
import { find } from 'linkifyjs';

export function extractFirstPreviewUrl(text?: string): string | null {
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

export type PreviewMetadataCacheType = {
  url: string;
  domain: string;
  title: string;
  imageUrl: string;
  timestamp: Date;
};

const previewMetadataCache = new Map<string, PreviewMetadataCacheType>();

export const getLinkPreviewMetadata = async (url: string): Promise<PreviewMetadataCacheType> => {
  const data = await Client.getLinkPreviewMetadata(url);

  return {
    ...data,
    title: data.title || '',
    imageUrl: data.image || '',
    url,
    domain: data.domain || '',
    timestamp: new Date(),
  };
};

export const isCacheValid = (cache: PreviewMetadataCacheType): boolean => {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  // Regular 24-hour cache for successful responses
  return cache.timestamp > oneDayAgo;
};

export { previewMetadataCache };
