import React, { useCallback } from 'react';
import { IconComponent } from '~/v4/core/IconComponent';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './VideoButton.module.css';
import clsx from 'clsx';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { Button } from '~/v4/core/natives/Button';

interface VideoButtonProps {
  pageId: string;
  componentId?: string;
  imgIconClassName?: string;
  defaultIconClassName?: string;
  onChangeVideos?: (files: File[]) => void;
  onChangeThumbnail?: (
    thumbnail: { file: File; videoUrl: string; thumbnail: string | undefined }[],
  ) => void;
  videoThumbnail?: { file: File; videoUrl: string; thumbnail: string | undefined }[];
}

const VideoButtonSvg = (props: React.SVGProps<SVGSVGElement>) => {
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
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        stroke={props.stroke}
        strokeWidth="1.3"
        stroke-miterlimit="10"
      />
      <path
        d="M16 12L10 8V16L16 12Z"
        stroke={props.stroke}
        strokeWidth="1.3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export function VideoButton({
  pageId = '*',
  componentId = '*',
  imgIconClassName,
  defaultIconClassName,
  onChangeVideos,
  onChangeThumbnail,
  videoThumbnail,
}: VideoButtonProps) {
  const elementId = 'video_button';
  const { themeStyles, isExcluded, config, accessibilityId, uiReference, defaultConfig } =
    useAmityElement({ pageId, componentId, elementId });

  if (isExcluded) return null;

  const { confirm } = useConfirmContext();

  const triggerFileInput = () => {
    const fileInput = document.getElementById('video-upload') as HTMLInputElement;
    fileInput.click();
  };

  const onLoad: React.ChangeEventHandler<HTMLInputElement> = useCallback(
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
        onChangeThumbnail?.((prevVideo) => [...prevVideo, ...updatedVideos]);
        videoThumbnail &&
          updatedVideos.forEach((video, index) =>
            generateThumbnail(video.file, index + videoThumbnail.length),
          );
      }
    },
    [onChangeVideos, videoThumbnail?.length, onChangeThumbnail],
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
      className={styles.videoButton}
      onPress={triggerFileInput}
    >
      <IconComponent
        defaultIcon={() => (
          <VideoButtonSvg className={clsx(styles.videoButton__icon, defaultIconClassName)} />
        )}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
      />
      {config.text && <Typography.BodyBold>{config.text}</Typography.BodyBold>}

      <input
        type="file"
        accept="video/*"
        onChange={onLoad}
        multiple
        id="video-upload"
        className={styles.videoButton__input}
      />
    </Button>
  );
}
