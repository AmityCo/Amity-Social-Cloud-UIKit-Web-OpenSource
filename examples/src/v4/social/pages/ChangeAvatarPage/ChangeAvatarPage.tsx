import React, { useState } from 'react';
import ImageCropper from '../../../../custom/components/ImageCropper/ImageCropper';
import styles from './ChangeAvatarPage.module.css';
import { Button, Typography } from '~/v4/core/components';
import ChevronLeft from '~/v4/icons/ChevronLeft';
import ChevronRight from '~/v4/icons/ChevronRight';
import { FileRepository } from '@amityco/ts-sdk';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';

interface ChangeAvatarPageProps {
  userId?: string;
  image: File | null;
  pageId: string;
  onBack?: () => void;
  onImageUploaded?: (uploadedImage: Amity.File<'image'>) => void;
}

export const ChangeAvatarPage: React.FC<ChangeAvatarPageProps> = ({
  userId,
  image,
  pageId,
  onBack,
  onImageUploaded,
}) => {
  const [croppedImageFile, setCroppedImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedAmityImage, setUploadedAmityImage] = useState<Amity.File<'image'> | null>(null);
  const { info } = useConfirmContext();

  const uploadImage = async (imageFile: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('files', imageFile);

    try {
      const { data } = await FileRepository.uploadImage(formData);
      const uploadedImage = data[0];
      setUploadedAmityImage(uploadedImage);
      onImageUploaded?.(uploadedImage);

      info({
        pageId: pageId,
        type: 'info',
        title: 'Immagine caricata',
        content: 'La tua immagine è stata caricata con successo.',
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes(ERROR_RESPONSE.IMAGE_NUDITY)) {
        info({
          pageId: pageId,
          type: 'info',
          title: 'Immagine inappropriata',
          content: "Per favore scegli un'immagine diversa da caricare.",
        });
      } else {
        info({
          pageId: pageId,
          type: 'info',
          title: 'Errore nel caricamento',
          content: 'Per favore riprova.',
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinue = () => {
    if (croppedImageFile) {
      uploadImage(croppedImageFile);
    } else if (image) {
      uploadImage(image);
    }
  };

  const handleSetFormData = (formData: any) => {
    if (formData.photo) {
      setCroppedImageFile(formData.photo);
    }
  };

  return (
    <div className={styles.changeAvatarPage}>
      <Typography.SubTitleBold>Carica la tua immagine</Typography.SubTitleBold>
      <div className={styles.cropperContainer}>
        <ImageCropper
          pageId={pageId}
          image={image ? ({ fileUrl: URL.createObjectURL(image) } as Amity.File<'image'>) : null}
          setFormData={handleSetFormData}
        />
      </div>
      <div className={styles.buttonContainer}>
        <Button variant="secondary" onClick={onBack}>
          <ChevronLeft />
        </Button>
        <Button onClick={handleContinue} disabled={isUploading || !image}>
          {isUploading ? 'Caricamento...' : 'Continua'}
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};
