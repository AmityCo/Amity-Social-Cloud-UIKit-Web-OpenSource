import { useRef } from 'react';
import { Button as AriaButton, FileTrigger } from 'react-aria-components';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { Camera } from '~/v4/core/design/icons/Camera';
import { Image } from '~/v4/core/design/icons/Image';
import { useString } from '~/v4/core/localization';
import styles from './MediaSection.module.css';

type MediaSectionProps = {
  onPickFile: (file: File) => void;
};

export function MediaSection({ onPickFile }: MediaSectionProps) {
  const cameraLabel = useString('amity_chat_media_camera');
  const mediaLabel = useString('amity_chat_media');
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  function pickFirst(files: FileList | File[] | null) {
    const file = files ? Array.from(files)[0] : undefined;
    if (file) onPickFile(file);
  }

  return (
    <div className={styles.mediaSection}>
      <div className={styles.mediaSection__row}>
        <AriaButton
          type="button"
          className={styles.mediaSection__item}
          aria-label={cameraLabel}
          onPress={() => cameraInputRef.current?.click()}
        >
          <span className={styles.mediaSection__chip}>
            <Camera className={styles.mediaSection__icon} />
          </span>
          <Typography.Caption className={styles.mediaSection__label}>
            {cameraLabel}
          </Typography.Caption>
        </AriaButton>
        <input
          ref={cameraInputRef}
          type="file"
          accept="video/*,image/*"
          capture="environment"
          className={styles.mediaSection__input}
          onChange={(event) => {
            pickFirst(event.target.files);
            event.target.value = '';
          }}
        />

        <FileTrigger
          allowsMultiple={false}
          acceptedFileTypes={['image/*', 'video/*']}
          onSelect={pickFirst}
        >
          <AriaButton type="button" className={styles.mediaSection__item} aria-label={mediaLabel}>
            <span className={styles.mediaSection__chip}>
              <Image className={styles.mediaSection__icon} />
            </span>
            <Typography.Caption className={styles.mediaSection__label}>
              {mediaLabel}
            </Typography.Caption>
          </AriaButton>
        </FileTrigger>
      </div>
    </div>
  );
}
