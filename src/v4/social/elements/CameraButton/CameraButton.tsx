import React, { useCallback, useState } from 'react';
import { IconComponent } from '~/v4/core/IconComponent';
import {  Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './CameraButton.module.css';
import clsx from 'clsx';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { Button } from '~/v4/core/natives/Button';

interface CameraButtonProps {
  pageId: string;
  componentId?: string;
  imgIconClassName?: string;
  defaultIconClassName?: string;
  onChange?: (files: File[]) => void;
  isVisibleImage?: boolean;
  isVisibleVideo?: boolean;
  onChangeVideos?: (files: File[]) => void;
  onChangeThumbnail?: (
    thumbnail: { file: File; videoUrl: string; thumbnail: string | undefined }[],
  ) => void;
  videoThumbnail?: { file: File; videoUrl: string; thumbnail: string | undefined }[];
}

const CameraSvg = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M19.5 19.5H4.5C4.10218 19.5 3.72064 19.342 3.43934 19.0607C3.15804 18.7794 3 18.3978 3 18V7.5C3 7.10218 3.15804 6.72064 3.43934 6.43934C3.72064 6.15804 4.10218 6 4.5 6H7.49945L8.99945 3.75H14.9995L16.4995 6H19.5C19.8978 6 20.2794 6.15804 20.5607 6.43934C20.842 6.72064 21 7.10218 21 7.5V18C21 18.3978 20.842 18.7794 20.5607 19.0607C20.2794 19.342 19.8978 19.5 19.5 19.5Z"
        stroke={props.stroke}
        strokeWidth="1.3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12 15.75C13.864 15.75 15.375 14.239 15.375 12.375C15.375 10.511 13.864 9 12 9C10.136 9 8.625 10.511 8.625 12.375C8.625 14.239 10.136 15.75 12 15.75Z"
        stroke={props.stroke}
        strokeWidth="1.3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export function CameraButton({
  pageId = '*',
  componentId = '*',
  imgIconClassName,
  defaultIconClassName,
  onChange,
  isVisibleImage,
  isVisibleVideo,
  onChangeVideos,
  videoThumbnail,
  onChangeThumbnail,
}: CameraButtonProps) {
  const elementId = 'camera_button';
  const { themeStyles, isExcluded, config, accessibilityId, uiReference, defaultConfig } =
    useAmityElement({ pageId, componentId, elementId });

  if (isExcluded) return null;
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const { confirm } = useConfirmContext();

  const triggerFileInput = () => {
    const fileInput = document.getElementById('upload') as HTMLInputElement;
    fileInput.click();
  };

  const onLoadVideo: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetFiles = e.target.files ? [...e.target.files] : [];

      const existingVideosCount = videoThumbnail ? videoThumbnail.length : 0;

      if (targetFiles.length + existingVideosCount > 10) {
        confirm({
          pageId: pageId,
          type: 'info',
          title: 'Maximum upload limit reached',
          content:
            'You’ve reached the upload limit of 10 videos. Any additional videos will not be saved. ',
          okText: 'Close',
        });
        return;
      }

      if (targetFiles.length) {
        onChangeVideos?.(targetFiles);
        const updatedVideos = targetFiles.map((file) => ({
          file,
          videoUrl: URL.createObjectURL(file),
          thumbnail: null,
        }));
        onChangeThumbnail?.((prevVideos) => [...prevVideos, ...updatedVideos]);
        videoThumbnail &&
          updatedVideos.forEach((video, index) =>
            generateThumbnail(video.file, index + videoThumbnail.length),
          );
      }
    },
    [onChangeVideos, videoThumbnail?.length, onChangeThumbnail],
  );

  const onLoadImage: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetFiles = e.target.files ? [...e.target.files] : [];

      if (targetFiles.length + uploadedImages.length > 10) {
        confirm({
          pageId: pageId,
          type: 'info',
          title: 'Maximum upload limit reached',
          content:
            'You’ve reached the upload limit of 10 images. Any additional images will not be saved. ',
          okText: 'Close',
        });
        return;
      }

      if (targetFiles.length) {
        setUploadedImages((prevImages) => [...prevImages, ...targetFiles]);
        onChange?.(targetFiles);
      }
    },
    [onChange],
  );

  const onLoadMedia: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetFiles = e.target.files ? [...e.target.files] : [];
      const isImage = targetFiles.some((file) => file.type.startsWith('image/'));
      const isVideo = targetFiles.some((file) => file.type.startsWith('video/'));

      if (isImage) {
        onLoadImage(e);
      } else if (isVideo) {
        onLoadVideo(e);
      }
    },
    [onLoadImage, onLoadVideo],
  );

  const generateThumbnail = (file: File, index: number) => {
    const videoElement = document.createElement('video');
    const canvasElement = document.createElement('canvas');
    const context = canvasElement.getContext('2d');

    videoElement.src = URL.createObjectURL(file);
    videoElement.currentTime = 10; // Seek to 10 seconds (you can adjust this)

    videoElement.addEventListener('loadeddata', () => {
      videoElement.pause();
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      context?.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
      const thumbnail = canvasElement.toDataURL('image/png');
      onChangeThumbnail?.((prevVideos) => {
        const newVideos = [...prevVideos];
        newVideos[index].thumbnail = thumbnail;
        return newVideos;
      });
    });
  };
  return (
    <Button
      style={themeStyles}
      data-qa-anchor={accessibilityId}
      className={styles.cameraButton}
      onPress={triggerFileInput}
    >
      <IconComponent
        defaultIcon={() => (
          <CameraSvg className={clsx(styles.cameraButton__icon, defaultIconClassName)} />
        )}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
      {config.text && <Typography.BodyBold>{config.text}</Typography.BodyBold>}

      {isVisibleImage && !isVisibleVideo && (
        <input
          type="file"
          onChange={onLoadImage}
          id="upload"
          accept="image/*"
          className={styles.cameraButton_input}
        />
      )}

      {!isVisibleImage && isVisibleVideo && (
        <input
          type="file"
          onChange={onLoadVideo}
          id="upload"
          accept="video/*"
          className={styles.cameraButton_input}
        />
      )}

      {isVisibleVideo && isVisibleVideo && (
        <input
          type="file"
          onChange={onLoadMedia}
          id="upload"
          accept="image/*,video/*"
          className={styles.cameraButton_input}
        />
      )}
    </Button>
  );
}
