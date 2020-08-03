import React, { useState, useEffect } from 'react';
import { customizableComponent } from '../hoks/customization';

import { ImageContainer, Content, ProgressBar, RemoveIcon } from './styles';

const Image = ({ image, onRemove }) => {
  // simulate progress animation
  const [progress, setProgress] = useState(0);
  useEffect(
    () => {
      if (progress >= 100) return;
      setTimeout(() => {
        setProgress(progress + 0.5);
      }, 50);
    },
    [progress],
  );

  return (
    <ImageContainer>
      <ProgressBar progress={progress} />
      <img src={image.url} />
      {!!onRemove && <RemoveIcon onClick={() => onRemove(image)} />}
    </ImageContainer>
  );
};

export default customizableComponent('Image')(Image);
