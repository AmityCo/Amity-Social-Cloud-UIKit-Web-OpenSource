import { useEffect, useMemo, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { mergeProps, useLongPress, usePress } from 'react-aria';
import Linkify from 'linkify-react';
import { FileRepository } from '@amityco/ts-sdk';
import { Button as AriaButton } from 'react-aria-components';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { Loader } from '~/v4/core/design/atoms/Loader';
import { VideoPlay } from '~/v4/core/design/icons/VideoPlay';
import { ChevronRight } from '~/v4/core/design/icons/ChevronRight';
import { ImageSlash } from '~/v4/core/design/icons/ImageSlash';
import { MediaUploadOverlay } from '~/v4/chat/elements/MediaUploadOverlay';
import { DeletedMessagePill } from '~/v4/chat/features/shared/components/DeletedMessagePill/DeletedMessagePill';
import { MessageLinkPreview } from '~/v4/chat/features/shared/components/MessageLinkPreview';
import {
  isSyntheticPendingMessage,
  type SyntheticPendingMessage,
} from '~/v4/chat/features/shared/hooks/useMessageComposer';
import { LONG_PRESS_THRESHOLD_MS, TEXT_MAX_LINES } from '~/v4/chat/constants';
import { extractFirstPreviewUrl } from '~/v4/chat/utils/previewLink';
import useFile from '~/v4/core/hooks/useFile';
import { useString } from '~/v4/core/localization';
import { resolveString } from '~/v4/core/localization/resolveString';
import styles from './MessageBubble.module.css';

type OnLongPressMessage = (message: Amity.Message, anchor: HTMLElement) => void;

type MessageBubbleProps = {
  message: Amity.Message;
  isUser: boolean;
  isActive?: boolean;
  onOpenImage: (url: string, message: Amity.Message) => void;
  onOpenVideo: (message: Amity.Message) => void;
  onSeeMore: (text: string) => void;
  onLongPress?: OnLongPressMessage;
  localPreviewUrl?: string;
  onMediaLoaded?: (fileId: string) => void;
  onCancelUpload?: (clientId: string) => void;
};

export function MessageBubble({
  message,
  isUser,
  isActive = false,
  onOpenImage,
  onOpenVideo,
  onSeeMore,
  onLongPress,
  localPreviewUrl,
  onMediaLoaded,
  onCancelUpload,
}: MessageBubbleProps) {
  if (message.isDeleted) {
    return <DeletedMessagePill isUser={isUser} />;
  }

  switch (message.dataType) {
    case 'text':
      return (
        <TextBubble
          message={message}
          isUser={isUser}
          isActive={isActive}
          onSeeMore={onSeeMore}
          onLongPress={onLongPress}
        />
      );
    case 'image':
      return (
        <ImageBubble
          message={message}
          isActive={isActive}
          onOpenImage={onOpenImage}
          onLongPress={onLongPress}
          localPreviewUrl={localPreviewUrl}
          onMediaLoaded={onMediaLoaded}
          onCancelUpload={onCancelUpload}
        />
      );
    case 'video':
      return (
        <VideoBubble
          message={message}
          isActive={isActive}
          onOpenVideo={onOpenVideo}
          onLongPress={onLongPress}
          localPreviewUrl={localPreviewUrl}
          onMediaLoaded={onMediaLoaded}
          onCancelUpload={onCancelUpload}
        />
      );
    case 'custom':
      return <CustomBubble message={message} onLongPress={onLongPress} />;
    default:
      return null;
  }
}

type TextBubbleProps = {
  message: Amity.Message;
  isUser: boolean;
  isActive?: boolean;
  onSeeMore: (text: string) => void;
  onLongPress?: OnLongPressMessage;
};

function TextBubble({
  message,
  isUser,
  isActive = false,
  onSeeMore,
  onLongPress,
}: TextBubbleProps) {
  const seeMoreLabel = useString('amity_chat_see_more');
  const editedLabel = useString('amity_chat_status_edited');
  const text = ((message.data as { text?: string } | undefined)?.text ?? '').toString();
  const maxLines = TEXT_MAX_LINES;
  const isFailed = message.syncState === ('error' as Amity.SyncState);
  const isSyncing = message.syncState === 'syncing';
  const isEdited = message.editedAt != null;

  const firstUrl = useMemo(() => {
    if (isFailed || isSyncing) return null;
    return extractFirstPreviewUrl(text);
  }, [text, isFailed, isSyncing]);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const { longPressProps } = useLongPress({
    isDisabled: !onLongPress || isFailed || isSyncing,
    threshold: LONG_PRESS_THRESHOLD_MS,
    onLongPress: () => {
      if (rootRef.current && onLongPress) onLongPress(message, rootRef.current);
    },
  });

  useEffect(() => {
    const node = textRef.current;
    if (!node) return;
    setIsOverflowing(node.scrollHeight > node.clientHeight + 1);
  }, [text, maxLines]);

  return (
    <div
      ref={rootRef}
      className={styles.textBubble}
      data-user={isUser ? 'own' : 'other'}
      data-active={isActive ? 'true' : 'false'}
      {...longPressProps}
    >
      <div ref={textRef} className={styles.textBubble__text} style={{ WebkitLineClamp: maxLines }}>
        {renderTextWithMentions(text, message.metadata as MessageMetadata | undefined)}
      </div>
      {firstUrl && (
        <div className={styles.textBubble__preview}>
          <MessageLinkPreview url={firstUrl} isOwnMessage={isUser} />
        </div>
      )}
      {isEdited && (
        <Typography.Caption className={styles.textBubble__editedCaption}>
          {editedLabel}
        </Typography.Caption>
      )}
      {isOverflowing && (
        <>
          <div className={styles.textBubble__divider} />
          <AriaButton
            type="button"
            className={styles.textBubble__seeMore}
            onPress={() => onSeeMore(text)}
            aria-label={seeMoreLabel}
          >
            <Typography.Caption className={styles.textBubble__seeMoreLabel}>
              {seeMoreLabel}
            </Typography.Caption>
            <ChevronRight className={styles.textBubble__seeMoreIcon} />
          </AriaButton>
        </>
      )}
    </div>
  );
}

type ImageBubbleProps = {
  message: Amity.Message;
  isActive?: boolean;
  onOpenImage: (url: string, message: Amity.Message) => void;
  onLongPress?: OnLongPressMessage;
  localPreviewUrl?: string;
  onMediaLoaded?: (fileId: string) => void;
  onCancelUpload?: (clientId: string) => void;
};

function ImageBubble({
  message,
  isActive = false,
  onOpenImage,
  onLongPress,
  localPreviewUrl,
  onMediaLoaded,
  onCancelUpload,
}: ImageBubbleProps) {
  const fileId =
    (message.data as { fileId?: string } | undefined)?.fileId ??
    (message as unknown as { fileId?: string }).fileId;
  const image = useFile<'image'>(fileId);
  const mediumUrl = image?.fileUrl ? FileRepository.fileUrlWithSize(image.fileUrl, 'medium') : null;
  const largeUrl = image?.fileUrl ? FileRepository.fileUrlWithSize(image.fileUrl, 'large') : null;
  const altText = image?.attributes?.name;
  const displaySrc = localPreviewUrl ?? mediumUrl;
  const isFailed = message.syncState === ('error' as Amity.SyncState);
  const isSyncing = message.syncState === 'syncing';
  const isSynthetic = isSyntheticPendingMessage(message);
  const [hasLoadError, setHasLoadError] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);

  const { longPressProps } = useLongPress({
    isDisabled: !onLongPress || isFailed || isSyncing,
    threshold: LONG_PRESS_THRESHOLD_MS,
    onLongPress: () => {
      if (rootRef.current && onLongPress) onLongPress(message, rootRef.current);
    },
  });

  const { pressProps } = usePress({
    isDisabled: !largeUrl || isFailed || isSynthetic,
    onPress: () => {
      if (largeUrl) onOpenImage(largeUrl, message);
    },
  });

  if (!displaySrc) {
    return (
      <div className={styles.mediaBubble__placeholder}>
        <Loader.Upload size="medium" className={styles.mediaBubble__spinner} />
      </div>
    );
  }

  if (hasLoadError && !localPreviewUrl) {
    return (
      <div className={styles.mediaBubble__broken} aria-label="Image unavailable">
        <ImageSlash className={styles.mediaBubble__brokenIcon} />
      </div>
    );
  }

  const showUploadOverlay = localPreviewUrl && !isFailed;

  const bubble = (
    <div
      ref={rootRef}
      role="button"
      tabIndex={0}
      aria-label="Open image"
      className={styles.imageBubble}
      data-active={isActive ? 'true' : 'false'}
      {...mergeProps(longPressProps, pressProps)}
    >
      <img
        src={displaySrc}
        alt={altText}
        className={styles.imageBubble__img}
        onError={() => setHasLoadError(true)}
      />
      {showUploadOverlay ? (
        <MediaUploadOverlay
          onCancel={
            isSynthetic && onCancelUpload
              ? () => onCancelUpload((message as SyntheticPendingMessage).__syntheticClientId)
              : undefined
          }
        />
      ) : null}
      {localPreviewUrl && mediumUrl ? (
        <img
          src={mediumUrl}
          alt=""
          aria-hidden="true"
          onLoad={() => fileId && onMediaLoaded?.(fileId)}
          className={styles.mediaBubble__preload}
        />
      ) : null}
    </div>
  );

  return wrapWithFailedCaption(bubble, isFailed, message);
}

type VideoBubbleProps = {
  message: Amity.Message;
  isActive?: boolean;
  onOpenVideo: (message: Amity.Message) => void;
  onLongPress?: OnLongPressMessage;
  localPreviewUrl?: string;
  onMediaLoaded?: (fileId: string) => void;
  onCancelUpload?: (clientId: string) => void;
};

function VideoBubble({
  message,
  isActive = false,
  onOpenVideo,
  onLongPress,
  localPreviewUrl,
  onMediaLoaded,
  onCancelUpload,
}: VideoBubbleProps) {
  const fileId =
    (message.data as { fileId?: string } | undefined)?.fileId ??
    (message as unknown as { fileId?: string }).fileId;
  const video = useFile<'video'>(fileId);
  const videoUrl = video?.fileUrl ?? null;
  const isFailed = message.syncState === ('error' as Amity.SyncState);
  const isSyncing = message.syncState === 'syncing';
  const isSynthetic = isSyntheticPendingMessage(message);

  const rootRef = useRef<HTMLDivElement | null>(null);

  const { longPressProps } = useLongPress({
    isDisabled: !onLongPress || isFailed || isSyncing,
    threshold: LONG_PRESS_THRESHOLD_MS,
    onLongPress: () => {
      if (rootRef.current && onLongPress) onLongPress(message, rootRef.current);
    },
  });

  const { pressProps } = usePress({
    isDisabled: isFailed || isSynthetic,
    onPress: () => onOpenVideo(message),
  });

  const hasSource = !!(localPreviewUrl || videoUrl);

  if (!hasSource) {
    return (
      <div className={styles.mediaBubble__placeholder}>
        <Loader.Upload size="medium" className={styles.mediaBubble__spinner} />
      </div>
    );
  }

  const bubble = (
    <div
      ref={rootRef}
      role="button"
      tabIndex={0}
      aria-label="Play video"
      className={styles.videoBubble}
      data-active={isActive ? 'true' : 'false'}
      {...mergeProps(longPressProps, pressProps)}
    >
      {localPreviewUrl ? (
        <video
          src={localPreviewUrl}
          preload="metadata"
          muted
          playsInline
          controls={false}
          className={styles.videoBubble__media}
        />
      ) : videoUrl ? (
        <video
          src={`${videoUrl}#t=0.1`}
          preload="metadata"
          muted
          playsInline
          controls={false}
          className={styles.videoBubble__media}
        />
      ) : null}
      {localPreviewUrl && videoUrl ? (
        <video
          src={`${videoUrl}#t=0.1`}
          preload="metadata"
          muted
          playsInline
          controls={false}
          aria-hidden="true"
          onLoadedMetadata={() => fileId && onMediaLoaded?.(fileId)}
          className={styles.mediaBubble__preload}
        />
      ) : null}
      {localPreviewUrl && !isFailed ? (
        <MediaUploadOverlay
          onCancel={
            isSynthetic && onCancelUpload
              ? () => onCancelUpload((message as SyntheticPendingMessage).__syntheticClientId)
              : undefined
          }
        />
      ) : (
        <span className={styles.videoBubble__playChip} aria-hidden="true">
          <VideoPlay className={styles.videoBubble__playIcon} />
        </span>
      )}
    </div>
  );

  return wrapWithFailedCaption(bubble, isFailed, message);
}

type CustomBubbleProps = {
  message: Amity.Message;
  onLongPress?: OnLongPressMessage;
};

function CustomBubble({ message, onLongPress }: CustomBubbleProps) {
  const data = message.data;
  const isFailed = message.syncState === ('error' as Amity.SyncState);
  const isSyncing = message.syncState === 'syncing';
  const rootRef = useRef<HTMLDivElement | null>(null);

  const { longPressProps } = useLongPress({
    isDisabled: !onLongPress || isFailed || isSyncing,
    threshold: LONG_PRESS_THRESHOLD_MS,
    onLongPress: () => {
      if (rootRef.current && onLongPress) onLongPress(message, rootRef.current);
    },
  });

  return (
    <div ref={rootRef} className={styles.customBubble} {...longPressProps}>
      <Typography.Body className={styles.customBubble__text}>
        {JSON.stringify(data)}
      </Typography.Body>
    </div>
  );
}

function getFailedCaption(message: Amity.Message): string {
  return resolveString('amity_chat_message_failed_to_send');
}

function wrapWithFailedCaption(
  bubble: ReactElement,
  isFailed: boolean,
  message: Amity.Message,
): ReactElement {
  const isCancelledUpload =
    isSyntheticPendingMessage(message) && message.__failureReason === 'cancelled';
  if (!isFailed || isCancelledUpload) return bubble;
  return (
    <div className={styles.mediaBubble__failedWrapper}>
      {bubble}
      <Typography.CaptionSmall className={styles.mediaBubble__failedCaption}>
        {getFailedCaption(message)}
      </Typography.CaptionSmall>
    </div>
  );
}

MessageBubble.Text = TextBubble;

MessageBubble.Image = ImageBubble;

MessageBubble.Video = VideoBubble;

MessageBubble.Custom = CustomBubble;

type MessageMetadata = {
  mentioned?: { index: number; length: number; type?: 'user' | 'channel'; userId?: string }[];
};

function renderTextWithMentions(text: string, metadata: MessageMetadata | undefined): ReactNode {
  const linkifyOptions = { target: '_blank', rel: 'noopener noreferrer' } as const;
  const mentioned = metadata?.mentioned ?? [];
  if (mentioned.length === 0) {
    return <Linkify options={linkifyOptions}>{text}</Linkify>;
  }

  const sorted = [...mentioned].sort((a, b) => a.index - b.index);
  const out: ReactNode[] = [];
  let cursor = 0;

  sorted.forEach((m, i) => {
    const startsWithAt = text.charAt(m.index) === '@';
    const span = startsWithAt ? m.length + 1 : m.length;
    const start = Math.max(m.index, cursor);
    const end = Math.min(start + span, text.length);
    if (start > cursor) {
      const lead = text.slice(cursor, start);
      out.push(
        <Linkify key={`t-${cursor}`} options={linkifyOptions}>
          {lead}
        </Linkify>,
      );
    }
    if (end > start) {
      out.push(
        <span key={`m-${i}`} className={styles.textBubble__mention}>
          {text.slice(start, end)}
        </span>,
      );
    }
    cursor = end;
  });

  if (cursor < text.length) {
    out.push(
      <Linkify key="t-tail" options={linkifyOptions}>
        {text.slice(cursor)}
      </Linkify>,
    );
  }

  return <>{out}</>;
}
