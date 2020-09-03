import React, { useState } from 'react';

import { customizableComponent } from 'hocs/customization';

import ImageGallery from 'components/ImageGallery';
import Image from './Image';

import { ImagesContainer } from './styles';

const MAX_IMAGES_IN_PREVIEW = 4;

const Images = ({ editing, images = [], onRemove }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const closeGallery = () => setSelectedImageIndex(null);

  const previewImages = editing ? images : images.slice(0, MAX_IMAGES_IN_PREVIEW);

  const numberOfHiddenImages = images.length - previewImages.length;

  return (
    <ImagesContainer length={previewImages.length}>
      {previewImages.map((image, i) => {
        const isLast = i === previewImages.length - 1;
        return (
          <Image
            key={image.id}
            numberOfHiddenImages={isLast && numberOfHiddenImages}
            editing={editing}
            image={image}
            onClick={() => !editing && setSelectedImageIndex(i)}
            onRemove={onRemove}
          />
        );
      })}
      {Number.isInteger(selectedImageIndex) && (
        <ImageGallery
          images={images}
          initialImageIndex={selectedImageIndex}
          onClose={closeGallery}
        />
      )}
    </ImagesContainer>
  );
};

export default customizableComponent('Images')(Images);
