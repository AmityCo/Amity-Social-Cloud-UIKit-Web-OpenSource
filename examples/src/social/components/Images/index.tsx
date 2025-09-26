import React, { memo, useState } from 'react';

import ImageGallery from '~/social/components/ImageGallery';
import Image from './Image';

import { ImagesContainer } from './styles';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

const MAX_IMAGES_IN_PREVIEW = 4;

interface ImagesProps {
  editing?: boolean;
  images?: (File & {
    isNew?: boolean;
    progress?: number;
    url: string;
  })[];
}

const Images = ({ editing, images = [] }: ImagesProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const closeGallery = () => setSelectedImageIndex(null);

  const previewImages = editing ? images : images.slice(0, MAX_IMAGES_IN_PREVIEW);

  const numberOfHiddenImages = images.length - previewImages.length;

  return (
    <ImagesContainer length={previewImages.length}>
      {previewImages.map((image, i) => {
        const isLast = i === previewImages.length - 1;
        return (
          <Image
            key={image.name}
            numberOfHiddenImages={isLast ? numberOfHiddenImages : undefined}
            image={image}
            onClick={() => setSelectedImageIndex(i)}
          />
        );
      })}
      {Number.isInteger(selectedImageIndex) && (
        <ImageGallery
          images={images}
          initialImageIndex={selectedImageIndex || -1}
          onClose={closeGallery}
        />
      )}
    </ImagesContainer>
  );
};

export default memo((props: ImagesProps) => {
  const CustomComponentFn = useCustomComponent('Images');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <Images {...props} />;
});
