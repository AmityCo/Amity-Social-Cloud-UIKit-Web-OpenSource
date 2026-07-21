import { useState } from 'react';
import { usePress } from 'react-aria';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { Skeleton } from '~/v4/core/design/components/Skeleton/Skeleton';
import { Loader } from '~/v4/core/design/atoms/Loader';
import { useString } from '~/v4/core/localization';
import { usePreviewLink } from '~/v4/core/hooks/usePreviewLink';
import { getHostName } from '~/v4/chat/utils/previewLink';
import { ImageSlash } from '~/v4/core/design/icons/ImageSlash';
import styles from './MessageLinkPreview.module.css';

type MessageLinkPreviewProps = {
  url: string;
  isOwnMessage: boolean;
  className?: string;
};

export function MessageLinkPreview({ url, isOwnMessage, className }: MessageLinkPreviewProps) {
  const { data, isLoading, isFetching, isError, isDebouncing } = usePreviewLink({ url });
  const [imageBroken, setImageBroken] = useState(false);
  const previewUnavailableTitle = useString('amity_chat_preview_not_available');
  const previewUnavailableSubtitle = useString('amity_chat_bubble_link_preview_no_data');

  const isPending = isLoading || isFetching || isDebouncing;
  const hasNoPreview = data != null && !data.title && !data.imageUrl;
  const isFailure = !isPending && (isError || hasNoPreview);

  const imageUrl = data?.imageUrl ?? '';
  const title = data?.title ?? '';
  const domain = data?.domain ?? '';
  const hasUsableImage = !!imageUrl && !imageBroken;

  const { pressProps } = usePress({
    isDisabled: isPending,
    onPress: () => {
      window.open(url, '_blank', 'noopener,noreferrer');
    },
  });

  const rootClass = [styles.messageLinkPreview, className].filter(Boolean).join(' ');
  const side = isOwnMessage ? 'right' : 'left';

  return (
    <button
      type="button"
      className={rootClass}
      disabled={isPending}
      data-side={side}
      {...pressProps}
    >
      <div
        className={styles.messageLinkPreview__thumbnail}
        data-side={side}
        data-state={isPending ? 'loading' : hasUsableImage ? 'image' : 'broken'}
      >
        {isPending ? (
          <Loader.Upload size="medium" />
        ) : hasUsableImage ? (
          <img
            src={imageUrl}
            alt=""
            className={styles.messageLinkPreview__thumbnailImg}
            onError={() => setImageBroken(true)}
          />
        ) : (
          <span className={styles.messageLinkPreview__thumbnailIcon} aria-hidden="true">
            <ImageSlash />
          </span>
        )}
      </div>

      <div className={styles.messageLinkPreview__info} data-state={isPending ? 'loading' : 'ready'}>
        {isPending ? (
          <Skeleton>
            <Skeleton.Line
              width="5rem"
              height="0.5rem"
              radius="0.75rem"
              bottom="0.5rem"
              className={styles.messageLinkPreview__skeletonLine}
            />
            <Skeleton.Line
              width="3.375rem"
              height="0.5rem"
              radius="0.75rem"
              className={styles.messageLinkPreview__skeletonLine}
            />
          </Skeleton>
        ) : isFailure ? (
          <>
            <Typography.CaptionBold className={styles.messageLinkPreview__title}>
              {previewUnavailableTitle}
            </Typography.CaptionBold>
            <Typography.CaptionSmall className={styles.messageLinkPreview__domain}>
              {previewUnavailableSubtitle}
            </Typography.CaptionSmall>
          </>
        ) : (
          <>
            <Typography.CaptionBold className={styles.messageLinkPreview__title}>
              {title || domain || url}
            </Typography.CaptionBold>
            <Typography.CaptionSmall className={styles.messageLinkPreview__domain}>
              {domain || getHostName(url)}
            </Typography.CaptionSmall>
          </>
        )}
      </div>
    </button>
  );
}
