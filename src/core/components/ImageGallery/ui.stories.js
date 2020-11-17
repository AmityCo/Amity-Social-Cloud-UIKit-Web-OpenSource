import React, { useState } from 'react';

import UiKitImageGallery from '.';

export default {
  title: 'Ui Only',
};

const placeholderImage = { url: 'https://via.placeholder.com/150x150' };

export const UiImageGallery = ({ numberOfImages, onChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleChange = newIndex => {
    onChange(newIndex);
    setCurrentIndex(newIndex);
  };

  const images = Array(numberOfImages).fill(placeholderImage);

  return <UiKitImageGallery currentIndex={currentIndex} images={images} onChange={handleChange} />;
};

UiImageGallery.storyName = 'Image Gallery';

UiImageGallery.args = {
  numberOfImages: 3,
};

UiImageGallery.argTypes = {
  numberOfImages: { control: { type: 'number', min: 1, step: 1 } },
  onChange: { action: 'onClick(newIndex)' },
};
