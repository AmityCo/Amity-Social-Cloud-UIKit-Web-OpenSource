import React, { useEffect, useState } from 'react';
import { useImage } from '~/v4/core/hooks/useImage';
import useSDK from '~/v4/core/hooks/useSDK';
import liveStreamDefaultThumbnail from '~/v4/social/assets/images/livestream-default-thumbnail.png';
import {
  getLivestreamAspectRatioString,
  LivestreamResolution,
} from '~/v4/social/features/livestream/utils/getLivestreamAspectRatio';
import styles from './LiveStreamThumbnail.module.css';

type LiveStreamThumbnailProps = {
  /**
   * User-uploaded thumbnail fileId (highest priority)
   */
  fileId?: string;
  alt: string;
  className?: string;
  /**
   * Room status to determine which thumbnail to show
   */
  status?: Amity.RoomStatus;
  /**
   * Thumbnail URL when room is live (requires authentication)
   */
  liveThumbnailUrl?: string;
  /**
   * Thumbnail URL when room is recorded (requires authentication)
   */
  recordedThumbnailUrl?: string;
  /**
   * Resolution data for dynamic aspect ratio calculation.
   * - If status is 'live': pass room.liveResolution
   * - If status is 'recorded': pass room.recordedResolution
   */
  resolution?: LivestreamResolution;
};

/**
 * Hook to fetch an authenticated image URL and return a blob URL
 */
function useAuthenticatedImage(url: string | undefined | null): string | null {
  const { client } = useSDK();
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setBlobUrl(null);
      return;
    }

    let isMounted = true;
    let objectUrl: string | null = null;

    const fetchImage = async () => {
      try {
        const headers: HeadersInit = {};
        if (client?.token?.accessToken) {
          headers['Authorization'] = `Bearer ${client.token.accessToken}`;
        }

        const response = await fetch(url, { headers });
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);

        if (isMounted) {
          setBlobUrl(objectUrl);
        }
      } catch (error) {
        console.error('Failed to fetch authenticated thumbnail:', error);
        if (isMounted) {
          setBlobUrl(null);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [url, client?.token?.accessToken]);

  return blobUrl;
}

export function LiveStreamThumbnail({
  fileId,
  alt,
  status,
  liveThumbnailUrl,
  recordedThumbnailUrl,
  resolution,
}: LiveStreamThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  // 1. User-uploaded thumbnail (highest priority)
  const userUploadedThumbnailUrl = useImage({ fileId });

  // 2. Authenticated thumbnails for live/recorded status
  const authenticatedLiveThumbnail = useAuthenticatedImage(
    !userUploadedThumbnailUrl && status === 'live' ? liveThumbnailUrl : null,
  );
  const authenticatedRecordedThumbnail = useAuthenticatedImage(
    !userUploadedThumbnailUrl && status === 'recorded' ? recordedThumbnailUrl : null,
  );

  // Priority: user uploaded > live thumbnail > recorded thumbnail > default
  const thumbnailSrc = hasError
    ? liveStreamDefaultThumbnail
    : userUploadedThumbnailUrl ||
      authenticatedLiveThumbnail ||
      authenticatedRecordedThumbnail ||
      liveStreamDefaultThumbnail;

  // Use 16:9 ratio (undefined) when showing default thumbnail, otherwise use dynamic resolution
  const isDefaultThumbnail = thumbnailSrc === liveStreamDefaultThumbnail;
  const aspectRatio = isDefaultThumbnail ? undefined : getLivestreamAspectRatioString(resolution);

  // Reset error state when thumbnail source changes
  useEffect(() => {
    setHasError(false);
  }, [userUploadedThumbnailUrl, authenticatedLiveThumbnail, authenticatedRecordedThumbnail]);

  const handleImageError = () => {
    setHasError(true);
  };

  return (
    <img
      style={{ aspectRatio }}
      alt={alt}
      loading="lazy"
      src={thumbnailSrc}
      onError={handleImageError}
      className={styles.liveStreamThumbnail}
    />
  );
}
