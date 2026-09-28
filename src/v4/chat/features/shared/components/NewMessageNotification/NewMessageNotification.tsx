import { FileRepository } from '@amityco/ts-sdk';
import { Button as AriaButton } from 'react-aria-components';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { resolveString } from '~/v4/core/localization';
import { Avatar } from '~/v4/chat/elements/Avatar';
import { ChevronDown } from '~/v4/core/design/icons/ChevronDown';
import { Image } from '~/v4/core/design/icons/Image';
import { VideoPlayBadge } from '~/v4/chat/elements/VideoPlayBadge';
import useFile from '~/v4/core/hooks/useFile';
import styles from './NewMessageNotification.module.css';

type NewMessageNotificationProps = {
  message: Amity.Message;
  onPress: () => void;
};

function getPreviewText(message: Amity.Message): string {
  switch (message.dataType) {
    case 'text':
      return (message.data as { text?: string } | undefined)?.text ?? '';
    case 'image':
      return resolveString('amity_chat_preview_sent_photo');
    case 'video':
      return resolveString('amity_chat_preview_sent_video');
    case 'custom':
      return resolveString('amity_chat_preview_message');
    default:
      return resolveString('amity_chat_preview_message');
  }
}

export function NewMessageNotification({ message, onPress }: NewMessageNotificationProps) {
  const isImage = message.dataType === 'image';
  const isVideo = message.dataType === 'video';
  const fileId = (message.data as { fileId?: string } | undefined)?.fileId;
  const imageFile = useFile<'image'>(isImage ? fileId : undefined);
  const videoFile = useFile<'video'>(isVideo ? fileId : undefined);
  const imageUrl = imageFile?.fileUrl
    ? FileRepository.fileUrlWithSize(imageFile.fileUrl, 'small')
    : null;
  const videoUrl = videoFile?.fileUrl ?? null;

  return (
    <AriaButton
      type="button"
      className={styles.newMessageNotification}
      onPress={onPress}
      aria-label="Scroll to new message"
    >
      <div className={styles.newMessageNotification__left}>
        {message.creator && <Avatar.User user={message.creator} size="xs" />}
        <Typography.Body className={styles.newMessageNotification__preview}>
          {getPreviewText(message)}
        </Typography.Body>
      </div>
      <div className={styles.newMessageNotification__right}>
        {(isImage || isVideo) && (
          <div className={styles.newMessageNotification__thumb}>
            {isVideo && videoUrl ? (
              <video
                src={`${videoUrl}#t=0.1`}
                preload="metadata"
                muted
                playsInline
                controls={false}
                className={styles.newMessageNotification__thumbImg}
              />
            ) : isImage && imageUrl ? (
              <img
                src={imageUrl}
                alt="Image preview"
                className={styles.newMessageNotification__thumbImg}
              />
            ) : (
              <Image className={styles.newMessageNotification__thumbFallback} />
            )}
            {isVideo && <VideoPlayBadge size={20} />}
          </div>
        )}
        <ChevronDown className={styles.newMessageNotification__chevron} />
      </div>
    </AriaButton>
  );
}
