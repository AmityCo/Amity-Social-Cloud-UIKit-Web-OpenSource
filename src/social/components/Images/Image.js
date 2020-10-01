import React, { useState, useEffect } from 'react';

import { ConditionalRender } from '~/core/components/ConditionalRender';
import { customizableComponent } from '~/core/hocs/customization';

import {
  ImageContainer,
  NumberOfHiddenImagesOverlay,
  OverlayContainer,
  LoadingOverlay,
  ProgressBarContainer,
  CloseIcon,
  CircleButton,
} from './styles';

import { ProgressBar } from '~/core/components/ProgressBar';

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

  return (
    <ImageContainer onClick={onClick}>
      <ConditionalRender condition={numberOfHiddenImages > 0}>
        <NumberOfHiddenImagesOverlay>+ {numberOfHiddenImages}</NumberOfHiddenImagesOverlay>
      </ConditionalRender>
      <ConditionalRender condition={isNew}>
        <OverlayContainer>
          <LoadingOverlay />
          <ProgressBarContainer>
            <ProgressBar progress={progress} lightMode />
          </ProgressBarContainer>
        </OverlayContainer>
      </ConditionalRender>
      <ConditionalRender condition={onRemove}>
        <CircleButton onClick={removeImage}>
          <CloseIcon />
        </CircleButton>
      </ConditionalRender>
      <img src={image.url} alt="" />
    </ImageContainer>
  );
};

export default customizableComponent('Image', Image);
