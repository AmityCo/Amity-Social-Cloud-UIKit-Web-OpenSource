import React from 'react';

import ConditionalRender from '~/core/components/ConditionalRender';
import customizableComponent from '~/core/hocs/customization';
import useKeyboard from '~/core/hooks/useKeyboard';

import {
  ImageGalleryContainer,
  ImageContainer,
  Counter,
  CloseIcon,
  LeftIcon,
  RightIcon,
} from './styles';

const ImageGallery = ({ currentIndex, images = [], onChange }) => {
  const { url: imageUrl } = images[currentIndex] ?? {};
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === images.length - 1;
  const handleClose = () => onChange(null);

  const next = () => !isLast && onChange(currentIndex + 1);
  const prev = () => !isFirst && onChange(currentIndex - 1);

  useKeyboard({
    ArrowLeft: prev,
    ArrowRight: next,
    Escape: handleClose,
  });

  return (
    <ConditionalRender condition={imageUrl}>
      <ImageGalleryContainer length={images.length}>
        <div>{!isFirst && <LeftIcon onClick={prev} />}</div>
        <ImageContainer>
          <Counter>
            {currentIndex + 1} / {images.length}
          </Counter>
          <img src={imageUrl} alt="" />
        </ImageContainer>
        <div>{!isLast && <RightIcon onClick={next} />}</div>
        <CloseIcon onClick={handleClose} />
      </ImageGalleryContainer>
    </ConditionalRender>
  );
};

export default customizableComponent('ImageGallery', ImageGallery);
