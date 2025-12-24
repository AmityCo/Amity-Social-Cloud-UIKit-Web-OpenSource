import { FileRepository } from '@amityco/ts-sdk';
import { FileTrigger } from 'react-aria-components';
import { isMobile } from '~/v4/social/utils/isMobile';
import { PAGE_ID } from '~/v4/constants/customization';
import { Button } from '~/v4/core/components/AriaButton';
import { CameraOutlined } from '~/v4/icons/CameraOutlined';
import useImageUpload from '~/v4/social/hooks/useImageUpload';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { ImageButton } from '~/v4/social/elements/ImageButton';
import { CameraButton } from '~/v4/social/elements/CameraButton';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import styles from './CoverImage.module.css';

type CoverImageProps = {
  value: Amity.File<'image'> | null;
  onChange: (file: Amity.File<'image'> | null) => void;
};

const MAX_FILE_SIZE_ONE_BG = 5 * 1024 * 1024;

export function CoverImage({ value, onChange }: CoverImageProps) {
  const { isDesktop } = useResponsive();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { uploadSingleImage, isUploading } = useImageUpload();
  const { info } = useConfirmContext();

  const handleCoverPhotoChange = async (files: File[]) => {
    const oversizedFile = files.find((file) => file.size > MAX_FILE_SIZE_ONE_BG);
    if (oversizedFile) {
      return info({
        title: 'File too large',
        content: 'The file exceeds the maximum upload size.',
      });
    }
    removeDrawerData();
    const uploadedImage = await uploadSingleImage({ file: files[0] });
    onChange(uploadedImage.data[0]);
  };

  return isDesktop ? (
    <FileTrigger
      allowsMultiple={false}
      acceptedFileTypes={['image/png', 'image/jpg', 'image/jpeg']}
      onSelect={async (files) => {
        if (!files || files.length === 0) return;
        const fileArray = Array.from(files);
        handleCoverPhotoChange(fileArray);
      }}
    >
      <Image isUploading={isUploading} value={value} />
    </FileTrigger>
  ) : (
    <Image
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
                  pageId={PAGE_ID.EVENT_SETUP_PAGE}
                  onImageFileChange={handleCoverPhotoChange}
                />
              )}
              <ImageButton
                isSingleUpload
                pageId={PAGE_ID.EVENT_SETUP_PAGE}
                onImageFileChange={handleCoverPhotoChange}
              />
            </>
          ),
        })
      }
    />
  );
}

type ImageUploadProps = {
  onPress?: () => void;
  isUploading: boolean;
  value: Amity.File<'image'> | null;
};

function Image({ isUploading, value, onPress }: ImageUploadProps) {
  return (
    <Button
      type="button"
      variant="default"
      onPress={onPress}
      isDisabled={isUploading}
      className={styles.coverImage}
      aria-label="Upload cover image of your event"
    >
      <span className={styles.coverImage__iconContainer}>
        {isUploading ? <Spinner /> : <CameraOutlined className={styles.coverImage__icon} />}
      </span>
      {value ? (
        <>
          <span className={styles.coverImage__overlay} />
          <img
            alt={value.altText || 'event cover'}
            className={styles.coverImage__image}
            src={FileRepository.fileUrlWithSize(value.fileUrl, 'medium')}
          />
        </>
      ) : (
        <span className={styles.coverImage__placeholder} />
      )}
    </Button>
  );
}
