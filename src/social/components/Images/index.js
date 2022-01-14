import React, { memo, useState } from 'react';

import customizableComponent from '~/core/hocs/customization';

import ImageGallery from '~/social/components/ImageGallery';
import ConditionalRender from '~/core/components/ConditionalRender';
import Image from './Image';

import { ImagesContainer } from './styles';

const MAX_IMAGES_IN_PREVIEW = 4;

const Images = ({ editing, images = [], onRemove, setImageLoaded }) => {
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
            image={image}
            fileId={image.fileId}
            setImageLoaded={setImageLoaded}
            onClick={() => setSelectedImageIndex(i)}
            onRemove={onRemove}
          />
        );
      })}
      <ConditionalRender condition={Number.isInteger(selectedImageIndex)}>
        <ImageGallery
          images={images}
          initialImageIndex={selectedImageIndex}
          onClose={closeGallery}
        />
      </ConditionalRender>
    </ImagesContainer>
  );
};

export default memo(customizableComponent('Images', Images));
