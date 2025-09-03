import React, { useCallback, useEffect, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { Trans, useTranslation } from 'react-i18next';
import PolicyNotice from './PolicyNotice';
import ZoomSlider from './ZoomSlider';
import styles from './ImageCropper.module.css';
import { UpdateUserProfileButton } from '~/v4/social/elements/UpdateUserProfileButton';

interface ImageCropperProps {
  pageId: string;
  image: Amity.File<'image'> | null | undefined;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export async function getCroppedImg(
  image: Amity.File<'image'> | null | undefined,
  pixelCrop: Area,
): Promise<File | null> {
  if (!image) {
    throw new Error('No image provided');
  }

  const img = new Image();
  img.src = image.fileUrl;
  img.crossOrigin = 'anonymous';

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context.'));
        return;
      }

      ctx.drawImage(
        img,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height,
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          const file = new File([blob], 'cropped_image.jpeg', {
            type: 'image/jpeg',
          });
          resolve(file);
        },
        'image/jpeg',
        0.95,
      );
    };
    img.onerror = (error) => {
      reject(error);
    };
  });
}

const ImageCropper: React.FC<ImageCropperProps> = ({ pageId, image, setFormData }) => {
  const { t } = useTranslation('registration');

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [minZoom, setMinZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleMediaLoaded = (mediaSize: { width: number; height: number }) => {
    const cropSize = 146;
    const { width: renderedWidth, height: renderedHeight } = mediaSize;
    const zoomX = cropSize / renderedWidth;
    const zoomY = cropSize / renderedHeight;
    const requiredZoom = Math.max(zoomX, zoomY, 1);

    setMinZoom(requiredZoom);
    setZoom(requiredZoom);
  };

  useEffect(() => {
    if (!croppedAreaPixels) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const croppedFile = await getCroppedImg(image, croppedAreaPixels);

        if (croppedFile) {
          setFormData((prev: any) => ({ ...prev, photo: croppedFile }));
        }
      } catch (e) {
        console.error('Error during debounced crop:', e);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [croppedAreaPixels, image, setFormData]);

  return (
    <div className={styles.container}>
      <div className={styles.cropperSection}>
        <div className={styles.cropperContainer}>
          <Cropper
            image={image?.fileUrl}
            aspect={1}
            cropShape="round"
            crop={crop}
            zoom={zoom}
            minZoom={minZoom}
            maxZoom={5}
            restrictPosition={true}
            showGrid={false}
            cropSize={{ width: 146, height: 146 }}
            onCropChange={setCrop}
            onMediaLoaded={handleMediaLoaded}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <ZoomSlider zoom={zoom} minZoom={minZoom} setZoom={setZoom} />
      </div>

      <div className={styles.infoSection}>
        <div className={styles.fileInfo}>
          <p>
            <Trans
              t={t}
              i18nKey="photo.fileType"
              components={{ bold: <span className={styles.bold} /> }}
            />
          </p>
          <p>
            <Trans
              t={t}
              i18nKey="photo.fileDimensions"
              components={{ bold: <span className={styles.bold} /> }}
            />
          </p>
        </div>
        <PolicyNotice />
      </div>
    </div>
  );
};

export default ImageCropper;
