import { Client } from '@amityco/ts-sdk';

export type PreviewMetadataCacheType = {
  url: string;
  domain: string;
  title: string;
  imageUrl: string;
  timestamp: Date;
};

const previewMetadataCache = new Map<string, PreviewMetadataCacheType>();

const FETCH_PREVIEW_TIMEOUT_5_SEC = 5000;

const CORS_PROXIES = [
  'https://api.cors.lol/?url=',
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
];

export const findDomainName = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
};

const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_PREVIEW_TIMEOUT_5_SEC);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
};

export const fetchPreviewMetadata = async (url: string): Promise<PreviewMetadataCacheType> => {
  const domain = findDomainName(url);

  const fetchWithFallback = async (proxyUrl: string) => {
    try {
      const response = await fetchWithTimeout(`${proxyUrl}${encodeURIComponent(url)}`, {
        headers: {
          Accept: 'text/html',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch preview');
      }

      return response.text();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Preview request timed out');
      }
      throw error;
    }
  };

  try {
    const data = await Client.fetchLinkPreview(url);

    if (!data.title) throw new Error('No data');

    return {
      ...data,
      imageUrl: data.image,
      url,
      domain,
      timestamp: new Date(),
    };
  } catch (error) {
    for (const proxy of CORS_PROXIES) {
      try {
        const text = await fetchWithFallback(proxy);
        const metadata = parseMetadata(text, url, domain);
        return metadata;
      } catch (proxyError) {
        console.warn(`Proxy ${proxy} failed: ${url}`, proxyError);
        continue;
      }
    }

    throw new Error('All CORS proxies failed');
  }
};

const parseMetadata = (text: string, url: string, domain: string): PreviewMetadataCacheType => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');

  const title =
    doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
    doc.querySelector('title')?.textContent ||
    '';

  const imageUrl =
    doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
    doc.querySelector('meta[property="twitter:image"]')?.getAttribute('content') ||
    doc.querySelector('meta[name="thumbnail"]')?.getAttribute('content') ||
    '';

  return {
    url,
    domain,
    title,
    imageUrl,
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
