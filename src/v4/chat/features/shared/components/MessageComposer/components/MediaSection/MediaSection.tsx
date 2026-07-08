import { CameraButton } from '~/v4/social/elements/CameraButton/CameraButton';
import { MediaButton } from '~/v4/social/elements/MediaButton/MediaButton';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';
import { useString } from '~/v4/core/localization';
import styles from './MediaSection.module.css';

type MediaSectionProps = {
  onPickFile: (file: File) => void;
};

export function MediaSection({ onPickFile }: MediaSectionProps) {
  const cameraLabel = useString('amity_chat_media_camera');
  const mediaLabel = useString('amity_chat_media');

  function handleFiles(files: File[]) {
    const file = files[0];
    if (!file) return;
    onPickFile(file);
  }

  return (
    <div className={styles.mediaSection}>
      <div className={styles.mediaSection__row}>
        <CameraButton
          isVisibleImage
          isVisibleVideo
          layout="column"
          captureMode="environment"
          text={cameraLabel}
          pageId={CHAT_PAGE_IDS.CHAT_PAGE}
          onImageFileChange={handleFiles}
          onVideoFileChange={handleFiles}
        />
        <MediaButton
          isSingleUpload
          layout="column"
          text={mediaLabel}
          pageId={CHAT_PAGE_IDS.CHAT_PAGE}
          onMediaFileChange={handleFiles}
        />
      </div>
    </div>
  );
}
