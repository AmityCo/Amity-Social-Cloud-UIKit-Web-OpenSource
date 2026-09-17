import { useState } from 'react';
import { Typography } from '~/v4/core/components';
import { useImage } from '~/v4/core/hooks/useImage';
import { getFileUrlWithSize } from '~/v4/utils/getFileUrlWithSize';
import VideoControl from '~/v4/icons/VideoControl';
import { BrokenImage } from '~/v4/icons/BrokenImage';
import ChevronRight from '~/v4/icons/ChevronRight';
import { MEDIA_DATA_TYPES } from '~/v4/social/features/discovery-widget/constants';
import styles from './Media.module.css';

type MediaProps = {
  post: Amity.Post;
};

export function Media({ post }: MediaProps) {
  const mediaChildren = (post.childrenPosts ?? []).filter((child) =>
    MEDIA_DATA_TYPES.includes(child.dataType),
  );
  const first = mediaChildren[0];
  const total = mediaChildren.length;

  const isImage = first?.dataType === 'image';
  const isClip = first?.dataType === 'clip';

  const showPlayIndicator = first?.dataType === 'video' || isClip;

  const showMultiIndicators = total > 1 && !isClip;

  const imageInfo = isImage ? (first as Amity.Post<'image'>).getImageInfo?.() : undefined;

  const imageUrl = imageInfo?.fileUrl;

  const altText = imageInfo?.altText ?? '';

  const thumbnailFileId = !isImage
    ? (first?.data as { thumbnailFileId?: string } | undefined)?.thumbnailFileId ?? ''
    : '';
  const resolvedThumbnail = useImage({ fileId: thumbnailFileId });

  const [isBroken, setIsBroken] = useState(false);

  const src = imageUrl ? getFileUrlWithSize(imageUrl) : resolvedThumbnail;

  if (!first) return null;

  return (
    <div className={styles.cardMedia}>
      <div className={styles.cardMedia__frame}>
        {src && !isBroken ? (
          <img
            src={src}
            alt={altText}
            loading="lazy"
            className={styles.cardMedia__image}
            onError={() => setIsBroken(true)}
          />
        ) : (
          <div className={styles.cardMedia__broken}>
            <BrokenImage className={styles.cardMedia__brokenIcon} />
          </div>
        )}

        {showMultiIndicators && (
          <>
            <div className={styles.cardMedia__counter} aria-hidden="true">
              <Typography.Body className={styles.cardMedia__counterText}>
                {`1/${total}`}
              </Typography.Body>
            </div>
            <div className={styles.cardMedia__navRight} aria-hidden="true">
              <ChevronRight className={styles.cardMedia__navIcon} />
            </div>
          </>
        )}

        {showPlayIndicator && (
          <div className={styles.cardMedia__playIndicator} aria-hidden="true">
            <VideoControl className={styles.cardMedia__playIcon} />
          </div>
        )}
      </div>
    </div>
  );
}
