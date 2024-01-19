import React, { useState } from 'react';

import {
  ImageGalleryContainer,
  ImageContainer,
  Counter,
  CloseIcon,
  LeftIcon,
  RightIcon,
} from './styles';
import useKeyboard from '~/core/hooks/useKeyboard';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

interface ImageGalleryProps {
  initialImageIndex: number;
  images: { url: string }[];
  onClose: () => void;
}

const ImageGallery = ({ initialImageIndex, images = [], onClose }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);

  const image = images[currentIndex];

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === images.length - 1;

  const next = () => !isLast && setCurrentIndex(currentIndex + 1);
  const prev = () => !isFirst && setCurrentIndex(currentIndex - 1);

  useKeyboard('ArrowRight', () => next());
  useKeyboard('ArrowLeft', () => prev());
  useKeyboard('Escape', () => onClose());

  return (
    <ImageGalleryContainer>
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

export default (props: ImageGalleryProps) => {
  const CustomComponentFn = useCustomComponent<ImageGalleryProps>('ImageGallery');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <ImageGallery {...props} />;
};
