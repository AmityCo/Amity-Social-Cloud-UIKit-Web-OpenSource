import { FileRepository } from '@amityco/ts-sdk';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { resolveString } from '~/v4/core/localization';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { Avatar } from '~/v4/chat/elements/Avatar';
import ArrowTop from '~/v4/icons/ArrowTop';
import { Image as ImageIcon } from '~/v4/icons/Image';
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
  const imageFileId = isImage
    ? (message.data as { fileId?: string } | undefined)?.fileId
    : undefined;
  const videoThumbFileId = isVideo
    ? (message.data as { thumbnailFileId?: string } | undefined)?.thumbnailFileId
    : undefined;
  const imageFile = useFile<'image'>(imageFileId);
  const videoThumbFile = useFile<'image'>(videoThumbFileId);
  const mediaThumb = isImage
    ? imageFile?.fileUrl
      ? FileRepository.fileUrlWithSize(imageFile.fileUrl, 'small')
      : null
    : isVideo
      ? videoThumbFile?.fileUrl
        ? FileRepository.fileUrlWithSize(videoThumbFile.fileUrl, 'small')
        : null
      : null;

  return (
    <Button
      type="button"
      variant="text"
      className={styles.newMessageNotification}
      onPress={onPress}
      aria-label="Scroll to new message"
    >
      <div className={styles.newMessageNotification__left}>
        {message.creator && <Avatar.User user={message.creator} size="sm" />}
        <Typography.Body className={styles.newMessageNotification__preview}>
          {getPreviewText(message)}
        </Typography.Body>
      </div>
      <div className={styles.newMessageNotification__right}>
        {(isImage || isVideo) && (
          <div className={styles.newMessageNotification__thumb}>
            {mediaThumb ? (
              <img
                src={mediaThumb}
                alt={isImage ? 'Image preview' : 'Video preview'}
                className={styles.newMessageNotification__thumbImg}
              />
            ) : (
              <ImageIcon className={styles.newMessageNotification__thumbFallback} />
            )}
          </div>
        )}
        <ArrowTop className={styles.newMessageNotification__arrow} />
      </div>
    </Button>
  );
}
