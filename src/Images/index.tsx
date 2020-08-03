import React, { useState, useEffect } from 'react';

import { customizableComponent } from '../hoks/customization';

import Image from './Image';

import { ImagesContainer } from './styles';

const Images = ({ images = [], onRemove }) => (
  <ImagesContainer length={images.length}>
    {images.map((image, i) => (
      <Image key={image.id} image={image} onRemove={onRemove} />
    ))}
  </ImagesContainer>
);

export default customizableComponent('Images')(Images);
