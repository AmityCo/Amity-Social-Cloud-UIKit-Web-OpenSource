import React, { useState, useEffect } from 'react';

import {
  ImageContainer,
  NumberOfHiddenImagesOverlay,
  OverlayContainer,
  LoadingOverlay,
  ProgressBarContainer,
  CloseIcon,
  CircleButton,
} from './styles';

import ProgressBar from '~/core/components/ProgressBar';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

interface ImageProps {
  image: File & {
    isNew?: boolean;
    progress?: number;
    url: string;
  };
  onClick?: () => void;
  onRemove?: (
    image: File & {
      isNew?: boolean;
      progress?: number;
      url: string;
    },
  ) => void;
  numberOfHiddenImages?: number;
}

const Image = ({ image, onClick, onRemove, numberOfHiddenImages }: ImageProps) => {
  const { isNew } = image;
  const [progress, setProgress] = useState(isNew ? image.progress || 0 : 100);

  useEffect(() => {
    if (!isNew || progress >= 100) {
      return;
    }
    const timeout = setTimeout(() => {
      setProgress(image.progress || 0);
    }, 150);
    return () => clearTimeout(timeout);
  }, [progress, image, isNew]);

  const removeImage: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    onRemove?.(image);
  };

  return (
    <ImageContainer data-qa-anchor="image" onClick={onClick}>
      {numberOfHiddenImages && numberOfHiddenImages > 0 && (
        <NumberOfHiddenImagesOverlay>+ {numberOfHiddenImages}</NumberOfHiddenImagesOverlay>
      )}

      {isNew && (
        <OverlayContainer>
          <LoadingOverlay />
          <ProgressBarContainer>
            <ProgressBar progress={progress} lightMode />
          </ProgressBarContainer>
        </OverlayContainer>
      )}

      {onRemove && (
        <CircleButton onClick={removeImage}>
          <CloseIcon />
        </CircleButton>
      )}
      <img src={image.url} alt={image.name} loading="lazy" />
    </ImageContainer>
  );
};

export default (props: ImageProps) => {
  const CustomComponentFn = useCustomComponent<ImageProps>('Image');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <Image {...props} />;
};
