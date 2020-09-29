import React, { useState, useEffect } from 'react';
import { customizableComponent } from 'hocs/customization';

import {
  ImageContainer,
  NumberOfHiddenImagesOverlay,
  OverlayContainer,
  LoadingOverlay,
  ProgressBarContainer,
  CloseIcon,
  CircleButton,
} from './styles';

import { ProgressBar } from '../ProgressBar';

const Image = ({ image, onClick, onRemove, numberOfHiddenImages, setImageLoaded }) => {
  // simulate progress animation
  const { isNew } = image;
  const [progress, setProgress] = useState(isNew ? 0 : 100);

  useEffect(() => {
    if (!isNew || progress >= 100) {
      isNew && setImageLoaded && setImageLoaded(image);
      return;
    }
    const timeout = setTimeout(() => {
      setProgress(progress + 0.5);
    }, 50);
    return () => clearTimeout(timeout);
  }, [progress]);

  const removeImage = e => {
    e.stopPropagation();
    onRemove(image);
  };

  // const showOverlay = progress < 100;

  return (
    <ImageContainer onClick={onClick}>
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
      {!!onRemove && (
        <CircleButton onClick={removeImage}>
          <CloseIcon />
        </CircleButton>
      )}
      <img src={image.url} alt="" />
    </ImageContainer>
  );
};

export default customizableComponent('Image', Image);
