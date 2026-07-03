import { FileRepository } from '@amityco/ts-sdk';
import { FileTrigger } from 'react-aria-components';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { CameraOutlined } from '~/v4/icons/CameraOutlined';
import { GroupChatBubble } from '~/v4/icons/GroupChatBubble';
import { AVATAR_ACCEPTED_IMAGE_TYPES, AVATAR_MAX_FILE_SIZE } from '~/v4/chat/constants';
import { resolveString, useString } from '~/v4/core/localization';
import useImageUpload from '~/v4/social/hooks/useImageUpload';
import { CameraButton } from '~/v4/social/elements/CameraButton/CameraButton';
import { ImageButton } from '~/v4/social/elements/ImageButton/ImageButton';
import { isMobile } from '~/v4/social/utils/isMobile';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import styles from './AvatarPicker.module.css';

type AvatarPickerProps = {
  pageId: string;
  value: Amity.File<'image'> | null;
  onChange: (file: Amity.File<'image'> | null) => void;
};

export function AvatarPicker({ pageId, value, onChange }: AvatarPickerProps) {
  const cameraLabel = useString('amity_chat_media_camera');
  const photoLabel = useString('amity_chat_media_photo');
  const { isDesktop } = useResponsive();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { uploadSingleImage, isUploading } = useImageUpload();
  const { info } = useConfirmContext();

  async function handleFileChange(files: File[]) {
    if (files.length === 0) return;
    const oversized = files.find((file) => file.size > AVATAR_MAX_FILE_SIZE);
    if (oversized) {
      removeDrawerData();
      return info({
        title: resolveString('amity_social_button_file_too_large'),
        content: resolveString('amity_social_label_file_exceeds_max_upload'),
      });
    }
    removeDrawerData();
    const uploaded = await uploadSingleImage({ file: files[0] });
    onChange(uploaded.data[0]);
  }

  return isDesktop ? (
    <FileTrigger
      allowsMultiple={false}
      acceptedFileTypes={AVATAR_ACCEPTED_IMAGE_TYPES}
      onSelect={(files) => files && handleFileChange(Array.from(files))}
    >
      <AvatarButton value={value} isUploading={isUploading} />
    </FileTrigger>
  ) : (
    <AvatarButton
      value={value}
      isUploading={isUploading}
      onPress={() =>
        setDrawerData({
          content: (
            <>
              {isMobile() && (
                <CameraButton
                  isVisibleImage
                  isVisibleVideo={false}
                  text={cameraLabel}
                  pageId={pageId}
                  onImageFileChange={handleFileChange}
                />
              )}
              <ImageButton
                isSingleUpload
                text={photoLabel}
                pageId={pageId}
                onImageFileChange={handleFileChange}
              />
            </>
          ),
        })
      }
    />
  );
}

type AvatarButtonProps = {
  value: Amity.File<'image'> | null;
  isUploading: boolean;
  onPress?: () => void;
};

function AvatarButton({ value, isUploading, onPress }: AvatarButtonProps) {
  return (
    <Button
      type="button"
      variant="default"
      onPress={onPress}
      isDisabled={isUploading}
      className={styles.avatarPicker}
      aria-label="Upload group avatar"
    >
      {value ? (
        <img
          alt={value.altText || 'group avatar'}
          className={styles.avatarPicker__image}
          src={FileRepository.fileUrlWithSize(value.fileUrl, 'medium')}
        />
      ) : (
        <span className={styles.avatarPicker__placeholder}>
          <GroupChatBubble className={styles.avatarPicker__placeholderIcon} />
        </span>
      )}
      <span className={styles.avatarPicker__overlay}>
        {isUploading ? <Spinner /> : <CameraOutlined className={styles.avatarPicker__cameraIcon} />}
      </span>
    </Button>
  );
}
