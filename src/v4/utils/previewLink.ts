import { Client } from '@amityco/ts-sdk';

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
