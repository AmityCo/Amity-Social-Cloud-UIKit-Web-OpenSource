import { useEffect, useRef, useState } from 'react';
import Linkify from 'linkify-react';
import { FileRepository } from '@amityco/ts-sdk';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import ReplyFilled from '~/v4/icons/ReplyFilled';
import VideoControl from '~/v4/icons/VideoControl';
import { TrashIcon } from '~/v4/icons/Trash';
import { useSDK } from '~/v4/core/hooks/useSDK';
import useFile from '~/v4/core/hooks/useFile';
import { useMessageObject } from '~/v4/chat/hooks/objects';
import { useString } from '~/v4/core/localization';
import { getReplyHeader } from '~/v4/chat/utils/getReplyHeader';
import { getReplyThumbnailSize } from '~/v4/chat/utils/getReplyThumbnailSize';
import styles from './MessageReplyQuote.module.css';

type MessageReplyQuoteProps = {
  parentId: string;
  child: Amity.Message;
  isUser: boolean;
  isGroupChat: boolean;
  onOpenSeeMore: (text: string, title?: string) => void;
  onOpenImage: (url: string, message: Amity.Message) => void;
  onOpenVideo: (message: Amity.Message) => void;
};

export function MessageReplyQuote({
  parentId,
  child,
  isUser,
  isGroupChat,
  onOpenSeeMore,
  onOpenImage,
  onOpenVideo,
}: MessageReplyQuoteProps) {
  const { currentUserId } = useSDK();
  const { message: parent, isLoading } = useMessageObject({ messageId: parentId });

  if (isLoading || !parent) {
    return (
      <div className={styles.replyQuote} data-user={isUser ? 'own' : 'other'}>
        <div className={styles.replyQuote__placeholder} aria-busy="true">
          <Spinner className={styles.replyQuote__spinner} />
        </div>
      </div>
    );
  }

  const headerText = getReplyHeader({ child, parent, currentUserId, isGroupChat });

  return (
    <div className={styles.replyQuote} data-user={isUser ? 'own' : 'other'}>
      <div className={styles.replyQuote__header}>
        <ReplyFilled className={styles.replyQuote__headerIcon} />
        <Typography.Caption className={styles.replyQuote__headerText}>
          {headerText}
        </Typography.Caption>
      </div>
      <ParentBody
        parent={parent}
        onOpenSeeMore={onOpenSeeMore}
        onOpenImage={onOpenImage}
        onOpenVideo={onOpenVideo}
      />
    </div>
  );
}

type ParentBodyProps = {
  parent: Amity.Message;
  onOpenSeeMore: (text: string, title?: string) => void;
  onOpenImage: (url: string, message: Amity.Message) => void;
  onOpenVideo: (message: Amity.Message) => void;
};

function ParentBody({ parent, onOpenSeeMore, onOpenImage, onOpenVideo }: ParentBodyProps) {
  if (parent.isDeleted) {
    return <DeletedQuote />;
  }
  switch (parent.dataType) {
    case 'text':
      return <TextQuote parent={parent} onOpenSeeMore={onOpenSeeMore} />;
    case 'custom':
      return <CustomQuote parent={parent} />;
    case 'image':
      return <ImageQuote parent={parent} onOpenImage={onOpenImage} />;
    case 'video':
      return <VideoQuote parent={parent} onOpenVideo={onOpenVideo} />;
    default:
      return null;
  }
}

function DeletedQuote() {
  const deletedLabel = useString('amity_chat_message_deleted');
  return (
    <div className={styles.replyQuote__quote}>
      <div className={styles.replyQuote__deletedBubble}>
        <TrashIcon className={styles.replyQuote__deletedIcon} />
        <Typography.Caption className={styles.replyQuote__deletedText}>
          {deletedLabel}
        </Typography.Caption>
      </div>
      <div className={styles.replyQuote__overlay} aria-hidden="true" />
    </div>
  );
}

type TextQuoteProps = {
  parent: Amity.Message;
  onOpenSeeMore: (text: string, title?: string) => void;
};

function TextQuote({ parent, onOpenSeeMore }: TextQuoteProps) {
  const text = ((parent.data as { text?: string } | undefined)?.text ?? '').toString();
  const repliedMessageTitle = useString('amity_chat_message_replied_message');
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={repliedMessageTitle}
      className={styles.replyQuote__quote}
      onClick={() => onOpenSeeMore(text, repliedMessageTitle)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenSeeMore(text, repliedMessageTitle);
        }
      }}
    >
      <div className={styles.replyQuote__textBubble}>
        <div className={styles.replyQuote__textClamp}>
          <Linkify
            options={{
              render: ({ content }) => <span className={styles.replyQuote__link}>{content}</span>,
            }}
          >
            {text}
          </Linkify>
        </div>
      </div>
      <div className={styles.replyQuote__overlay} aria-hidden="true" />
    </div>
  );
}

type CustomQuoteProps = {
  parent: Amity.Message;
};

function CustomQuote({ parent }: CustomQuoteProps) {
  const text = JSON.stringify(parent.data ?? {});
  return (
    <div className={styles.replyQuote__quote}>
      <div className={styles.replyQuote__textBubble}>
        <div className={styles.replyQuote__textClamp}>{text}</div>
      </div>
      <div className={styles.replyQuote__overlay} aria-hidden="true" />
    </div>
  );
}

type ImageQuoteProps = {
  parent: Amity.Message;
  onOpenImage: (url: string, message: Amity.Message) => void;
};

function ImageQuote({ parent, onOpenImage }: ImageQuoteProps) {
  const fileId = (parent.data as { fileId?: string } | undefined)?.fileId;
  const file = useFile<'image'>(fileId);
  const mediumUrl = file?.fileUrl ? FileRepository.fileUrlWithSize(file.fileUrl, 'medium') : null;
  const largeUrl = file?.fileUrl ? FileRepository.fileUrlWithSize(file.fileUrl, 'large') : null;
  const [size, setSize] = useState<{ widthRem: number; heightRem: number }>({
    widthRem: 7.5,
    heightRem: 7.5,
  });
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const node = imgRef.current;
    if (node && node.complete && node.naturalWidth > 0) {
      setSize(getReplyThumbnailSize(node.naturalWidth, node.naturalHeight));
    }
  }, [mediumUrl]);

  if (!mediumUrl) {
    return (
      <div className={styles.replyQuote__placeholder} aria-busy="true">
        <Spinner className={styles.replyQuote__spinner} />
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Open image"
      className={styles.replyQuote__quote}
      onClick={() => largeUrl && onOpenImage(largeUrl, parent)}
      onKeyDown={(e) => {
        if (largeUrl && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onOpenImage(largeUrl, parent);
        }
      }}
    >
      <img
        ref={imgRef}
        src={mediumUrl}
        alt=""
        className={styles.replyQuote__media}
        style={{ width: `${size.widthRem}rem`, height: `${size.heightRem}rem` }}
        onLoad={(e) => {
          const target = e.currentTarget;
          setSize(getReplyThumbnailSize(target.naturalWidth, target.naturalHeight));
        }}
      />
      <div className={styles.replyQuote__overlay} aria-hidden="true" />
    </div>
  );
}

type VideoQuoteProps = {
  parent: Amity.Message;
  onOpenVideo: (message: Amity.Message) => void;
};

function VideoQuote({ parent, onOpenVideo }: VideoQuoteProps) {
  const fileId = (parent.data as { fileId?: string } | undefined)?.fileId;
  const file = useFile<'video'>(fileId);
  const videoUrl = file?.fileUrl ?? null;
  const [size, setSize] = useState<{ widthRem: number; heightRem: number }>({
    widthRem: 7.5,
    heightRem: 7.5,
  });

  if (!videoUrl) {
    return (
      <div className={styles.replyQuote__placeholder} aria-busy="true">
        <Spinner className={styles.replyQuote__spinner} />
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Play video"
      className={styles.replyQuote__quote}
      onClick={() => onOpenVideo(parent)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenVideo(parent);
        }
      }}
    >
      <video
        src={`${videoUrl}#t=0.1`}
        preload="metadata"
        muted
        playsInline
        controls={false}
        className={styles.replyQuote__media}
        style={{ width: `${size.widthRem}rem`, height: `${size.heightRem}rem` }}
        onLoadedMetadata={(e) => {
          const target = e.currentTarget;
          setSize(getReplyThumbnailSize(target.videoWidth, target.videoHeight));
        }}
      />
      <div className={styles.replyQuote__videoOverlay} aria-hidden="true">
        <VideoControl className={styles.replyQuote__videoIcon} />
      </div>
      <div className={styles.replyQuote__overlay} aria-hidden="true" />
    </div>
  );
}
