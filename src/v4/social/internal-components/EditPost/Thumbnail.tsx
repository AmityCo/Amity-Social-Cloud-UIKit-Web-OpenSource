import React from 'react';
import styles from './Thumbnail.module.css';
import { useImage } from '~/v4/core/hooks/useImage';
import { CloseIcon, Play } from '~/icons';
import { PostContentType } from '@amityco/ts-sdk';
import { Button } from '~/v4/core/natives/Button';

const MediaComponent = ({
  fieldId,
  onRemove,
  type,
}: {
  fieldId: string;
  onRemove: () => void;
  type: 'image' | 'video';
}) => {
  const thumbnailUrl = useImage({ fileId: fieldId });

  if (!thumbnailUrl) return null;
  return (
    <>
      <img className={styles.thumbnail} src={thumbnailUrl} alt="thumbnail" />
      <Button type="reset" onPress={() => onRemove()} className={styles.thumbnail__closeButton}>
        <CloseIcon className={styles.thumbnail__closeIcon} />
      </Button>
      {type === PostContentType.VIDEO && (
        <div className={styles.playIcon} data-image="test">
          <Play />
        </div>
      )}
    </>
  );
};

export const Thumbnail = ({
  postMedia,
  onRemove,
}: {
  postMedia: Amity.Post<'image' | 'video'>[];
  onRemove: (fileId: string) => void;
}) => {
  if (postMedia.length == 0) return null;

  return (
    <div data-images-amount={Math.min(postMedia.length, 3)} className={styles.thumbnail__container}>
      {postMedia?.map((file, index: number) => (
        <div
          key={index}
          data-images-height={postMedia.length > 2}
          className={styles.thumbnail__wrapper}
        >
          <MediaComponent
            type={file.dataType}
            key={index}
            fieldId={
              file.dataType === PostContentType.IMAGE ? file.data.fileId : file.data.thumbnailFileId
            }
            onRemove={() =>
              onRemove(
                file.dataType === PostContentType.IMAGE
                  ? file.data.fileId
                  : file.data.videoFileId.original,
              )
            }
          />
        </div>
      ))}
    </div>
  );
};
