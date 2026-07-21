import { FileRepository } from '@amityco/ts-sdk';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { Cross } from '~/v4/core/design/icons/Cross';
import { CirclePlay } from '~/v4/core/design/icons/CirclePlay';
import useFile from '~/v4/core/hooks/useFile';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { useMessageObject } from '~/v4/chat/hooks/objects';
import { useString } from '~/v4/core/localization';
import styles from './MessageReplyBand.module.css';

type MessageReplyBandProps = {
  replyTo: Amity.Message;
  onCancel: () => void;
  onOpenSeeMore: (text: string, title?: string) => void;
  onOpenImage: (url: string, message: Amity.Message) => void;
  onOpenVideo: (message: Amity.Message) => void;
};

export function MessageReplyBand({
  replyTo,
  onCancel,
  onOpenSeeMore,
  onOpenImage,
  onOpenVideo,
}: MessageReplyBandProps) {
  const { currentUserId } = useSDK();
  const yourselfLabel = useString('amity_chat_message_replying_yourself');
  const unknownUserLabel = useString('amity_chat_unknown_user');
  const repliedMessageTitle = useString('amity_chat_message_replied_message');
  const replyingToLabel = useString('amity_chat_replying_to');
  const { message: liveParent } = useMessageObject({ messageId: replyTo.messageId });
  const isParentDeleted = !!(liveParent?.isDeleted ?? replyTo.isDeleted);
  const isToYourself = replyTo.creatorId === currentUserId;
  const replyName = isToYourself
    ? yourselfLabel
    : (replyTo as unknown as { creator?: { displayName?: string } }).creator?.displayName ??
      unknownUserLabel;

  function handleBandClick() {
    if (isParentDeleted) return;
    if (replyTo.dataType === 'text') {
      const text = ((replyTo.data as { text?: string } | undefined)?.text ?? '').toString();
      onOpenSeeMore(text, repliedMessageTitle);
      return;
    }
    if (replyTo.dataType === 'image') {
      onOpenImage('', replyTo);
      return;
    }
    if (replyTo.dataType === 'video') {
      onOpenVideo(replyTo);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={repliedMessageTitle}
      className={styles.replyBand}
      onClick={handleBandClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleBandClick();
        }
      }}
    >
      <div className={styles.replyBand__text}>
        <div className={styles.replyBand__title}>
          <Typography.CaptionBold>{replyingToLabel}</Typography.CaptionBold>
          <Typography.CaptionBold className={styles.replyBand__titleName}>
            {' '}
            {replyName}
          </Typography.CaptionBold>
        </div>
        <ReplyBandBody replyTo={replyTo} isParentDeleted={isParentDeleted} />
      </div>
      {!isParentDeleted ? <ReplyBandThumb replyTo={replyTo} /> : null}
      <button
        type="button"
        className={styles.replyBand__close}
        aria-label="Cancel reply"
        onClick={(e) => {
          e.stopPropagation();
          onCancel();
        }}
      >
        <Cross className={styles.replyBand__closeIcon} />
      </button>
    </div>
  );
}

function ReplyBandBody({
  replyTo,
  isParentDeleted,
}: {
  replyTo: Amity.Message;
  isParentDeleted: boolean;
}) {
  const unavailableLabel = useString('amity_chat_message_unavailable');
  if (isParentDeleted) {
    return (
      <Typography.Caption className={styles.replyBand__body}>{unavailableLabel}</Typography.Caption>
    );
  }
  if (replyTo.dataType === 'text') {
    const text = ((replyTo.data as { text?: string } | undefined)?.text ?? '').toString();
    return <Typography.Caption className={styles.replyBand__body}>{text}</Typography.Caption>;
  }
  if (replyTo.dataType === 'image') {
    return <ReplyBandPhotoLabel />;
  }
  if (replyTo.dataType === 'video') {
    return <ReplyBandVideoLabel />;
  }
  if (replyTo.dataType === 'custom') {
    return (
      <Typography.Caption className={styles.replyBand__body}>
        {JSON.stringify(replyTo.data ?? {})}
      </Typography.Caption>
    );
  }
  return null;
}

function ReplyBandThumb({ replyTo }: { replyTo: Amity.Message }) {
  if (replyTo.dataType === 'image') {
    return <ImageThumb replyTo={replyTo} />;
  }
  if (replyTo.dataType === 'video') {
    return <VideoThumb replyTo={replyTo} />;
  }
  return null;
}

function ImageThumb({ replyTo }: { replyTo: Amity.Message }) {
  const fileId = (replyTo.data as { fileId?: string } | undefined)?.fileId;
  const file = useFile<'image'>(fileId);
  const url = file?.fileUrl ? FileRepository.fileUrlWithSize(file.fileUrl, 'small') : null;
  if (!url) return null;
  return (
    <div className={styles.replyBand__thumbWrap}>
      <img src={url} alt="" className={styles.replyBand__thumb} />
    </div>
  );
}

function VideoThumb({ replyTo }: { replyTo: Amity.Message }) {
  const fileId = (replyTo.data as { fileId?: string } | undefined)?.fileId;
  const file = useFile<'video'>(fileId);
  const url = file?.fileUrl ?? null;
  if (!url) return null;
  return (
    <div className={styles.replyBand__thumbWrap}>
      <video
        src={`${url}#t=0.1`}
        preload="metadata"
        muted
        playsInline
        controls={false}
        className={styles.replyBand__thumb}
      />
      <div className={styles.replyBand__videoOverlay} aria-hidden="true">
        <CirclePlay.Solid className={styles.replyBand__videoIcon} />
      </div>
    </div>
  );
}

function ReplyBandPhotoLabel() {
  const photoLabel = useString('amity_chat_reply_photo_label');
  return <Typography.Caption className={styles.replyBand__body}>{photoLabel}</Typography.Caption>;
}

function ReplyBandVideoLabel() {
  const videoLabel = useString('amity_chat_reply_video_label');
  return <Typography.Caption className={styles.replyBand__body}>{videoLabel}</Typography.Caption>;
}
