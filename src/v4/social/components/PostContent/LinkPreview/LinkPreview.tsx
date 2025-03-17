import React from 'react';
import { Typography } from '~/v4/core/components/Typography';

import { LinkPreviewSkeleton } from './LinkPreviewSkeleton';
import styles from './LinkPreview.module.css';
import { Button } from '~/v4/core/natives/Button';
import { usePreviewLink } from '~/v4/core/hooks/usePreviewLink';
import { findDomainName } from '~/v4/utils/previewLink';
import { Caution } from '~/v4/icons/Caution';
import { ImagePreview } from '~/v4/icons/ImagePreview';

interface LinkPreviewProps {
  pageId?: string;
  componentId?: string;
  url: string;
}

const ErrorPreview = () => (
  <div className={styles.linkPreview__unableToPreview}>
    <Caution className={styles.linkPreview__unableToPreview__icon} />
  </div>
);

const UnableToPreview = () => (
  <div className={styles.linkPreview__unableToPreview}>
    <ImagePreview className={styles.linkPreview__unableToPreview__icon} />
  </div>
);

export function LinkPreview({ pageId = '*', componentId = '*', url }: LinkPreviewProps) {
  const previewData = usePreviewLink({ url });
  const domain = findDomainName(url);
  const [imageError, setImageError] = React.useState(false);

  const handleClick = () => {
    window.open(url, '_blank');
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (previewData.isLoading) return <LinkPreviewSkeleton />;

  if (previewData.isError) {
    return (
      <Button onPress={handleClick} className={styles.linkPreview}>
        <div className={styles.linkPreview__top}>
          <ErrorPreview />
        </div>
        <div className={styles.linkPreview__bottom}>
          <Typography.Caption className={styles.linkPreview__domain}>
            Preview not available
          </Typography.Caption>
          <Typography.BodyBold>
            Please make sure the URL is correct and try again.
          </Typography.BodyBold>
        </div>
      </Button>
    );
  }

  return (
    <Button
      data-testid={`${pageId}/${componentId}/post_preview_link`}
      onPress={handleClick}
      className={styles.linkPreview}
    >
      <div className={styles.linkPreview__top}>
        {previewData.data?.imageUrl && !imageError ? (
          <img
            src={previewData.data.imageUrl}
            alt={previewData.data.title || 'Link preview'}
            className={styles.linkPreview__object}
            onError={handleImageError}
          />
        ) : (
          <UnableToPreview />
        )}
      </div>
      <div className={styles.linkPreview__bottom}>
        <Typography.Caption className={styles.linkPreview__domain}>{domain}</Typography.Caption>
        <Typography.BodyBold>{previewData.data?.title || ''}</Typography.BodyBold>
      </div>
    </Button>
  );
}
