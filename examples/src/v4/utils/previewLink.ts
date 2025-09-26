export type PreviewMetadataCacheType = {
  url: string;
  domain: string;
  title: string;
  imageUrl: string;
  timestamp: Date;
};

const previewMetadataCache = new Map<string, PreviewMetadataCacheType>();

const FETCH_PREVIEW_TIMEOUT_MS = 3000; // 3 seconds

export const findDomainName = (url: string): string => {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
};

const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_PREVIEW_TIMEOUT_MS);

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
  const CORS_PROXY = 'https://api.cors.lol/?url=';
  const domain = findDomainName(url);

  try {
    const response = await fetchWithTimeout(`${CORS_PROXY}${encodeURIComponent(url)}`, {
      headers: {
        Accept: 'text/html',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch preview');
    }

    const text = await response.text();
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

    const metadata: PreviewMetadataCacheType = {
      url,
      domain,
      title,
      imageUrl,
      timestamp: new Date(),
    };

    return metadata;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Preview request timed out');
    }
    throw error;
  }
};

export const isCacheValid = (cache: PreviewMetadataCacheType): boolean => {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  // Regular 24-hour cache for successful responses
  return cache.timestamp > oneDayAgo;
};

export { previewMetadataCache };
