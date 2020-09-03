import React, { useState, useEffect } from 'react';

import { customizableComponent } from 'hocs/customization';

import {
  ImageGalleryContainer,
  ImageContainer,
  Counter,
  CloseIcon,
  LeftIcon,
  RightIcon,
} from './styles';

const useKeyboardNavigation = (prev, next, onClose) => {
  useEffect(() => {
    const listener = e => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [prev, next, onClose]);
};

const ImageGallery = ({ initialImageIndex, images = [], onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);

  const image = images[currentIndex];

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === images.length - 1;

  const next = () => !isLast && setCurrentIndex(currentIndex + 1);
  const prev = () => !isFirst && setCurrentIndex(currentIndex - 1);

  useKeyboardNavigation(prev, next, onClose);

  return (
    <ImageGalleryContainer length={images.length}>
      <div>{!isFirst && <LeftIcon onClick={prev} />}</div>
      <ImageContainer>
        <Counter>
          {currentIndex + 1} / {images.length}
        </Counter>
        <img src={image.url} alt="" />
      </ImageContainer>
      <div>{!isLast && <RightIcon onClick={next} />}</div>
      <CloseIcon onClick={onClose} />
    </ImageGalleryContainer>
  );
};

export default customizableComponent('ImageGallery')(ImageGallery);
