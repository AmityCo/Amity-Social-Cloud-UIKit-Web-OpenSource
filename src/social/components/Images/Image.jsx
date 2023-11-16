import React, { useState, useEffect } from 'react';
import customizableComponent from '~/core/hocs/customization';

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

const Image = ({ image, onClick, onRemove, numberOfHiddenImages }) => {
  const { isNew } = image;
  const [progress, setProgress] = useState(isNew ? image.progress : 100);

  useEffect(() => {
    if (!isNew || progress >= 100) {
      return;
    }
    const timeout = setTimeout(() => {
      setProgress(image.progress);
    }, 150);
    return () => clearTimeout(timeout);
  }, [progress, image, isNew]);

  const removeImage = (e) => {
    e.stopPropagation();
    onRemove(image);
  };

  return (
    <ImageContainer data-qa-anchor="image" onClick={onClick}>
      {numberOfHiddenImages > 0 && (
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

export default customizableComponent('Image', Image);
