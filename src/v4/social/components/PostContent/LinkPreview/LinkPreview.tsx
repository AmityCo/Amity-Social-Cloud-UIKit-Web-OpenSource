import React, { useEffect } from 'react';
import { Typography } from '~/v4/core/components/Typography';
import { LinkPreviewSkeleton } from './LinkPreviewSkeleton';
import styles from './LinkPreview.module.css';
import { Button } from '~/v4/core/natives/Button';
import { usePreviewLink } from '~/v4/core/hooks/usePreviewLink';
import { ImagePreview } from '~/v4/icons/ImagePreview';

interface LinkPreviewProps {
  pageId?: string;
  componentId?: string;
  url: string;
  onLoadingChange?: (isLoading: boolean) => void;
}

const UnableToPreview = () => (
  <div className={styles.linkPreview__unableToPreview}>
    <ImagePreview className={styles.linkPreview__unableToPreview__icon} />
  </div>
);

export function LinkPreview({
  pageId = '*',
  componentId = '*',
  url,
  onLoadingChange,
}: LinkPreviewProps) {
  const previewData = usePreviewLink({ url });
  const [imageError, setImageError] = React.useState(false);

  const isLoading = previewData.isDebouncing || previewData.isLoading || previewData.isFetching;

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  const handleClick = () => {
    let redirectUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('ftp://')) {
      redirectUrl = `https://${url}`;
    }
    window.open(redirectUrl, '_blank');
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (isLoading) {
    return <LinkPreviewSkeleton />;
  }

  return (
    <Button
      data-testid={`${pageId}/${componentId}/post_preview_link`}
      onPress={handleClick}
      className={styles.linkPreview}
    >
      {previewData.data?.imageUrl && (
        <div className={styles.linkPreview__top}>
          {!imageError ? (
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
      )}

      <div className={styles.linkPreview__bottom}>
        <Typography.BodyBold className={styles.linkPreview__title}>
          {previewData.data?.title || url}
        </Typography.BodyBold>
        <Typography.Caption className={styles.linkPreview__domain}>
          {previewData.data?.domain || url}
        </Typography.Caption>
      </div>
    </Button>
  );
}
