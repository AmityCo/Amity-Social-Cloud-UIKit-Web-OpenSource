import React from 'react';
import styled from 'styled-components';

import UiKitGalleryGrid from '.';

export default {
  title: 'Ui Only/Gallery Grid',
};

export const GalleryGrid = ({ images, truncate, onClick }) => {
  const imageUrls = new Array(images).fill(0).map((_, i) => `https://cataas.com/cat?${i}`);
  return <UiKitGalleryGrid items={imageUrls} truncate={truncate} onClick={onClick} />;
};

GalleryGrid.storyName = 'Default renderer';

GalleryGrid.args = {
  images: 1,
  truncate: false,
};

GalleryGrid.argTypes = {
  images: { control: { type: 'number', min: 1, step: 1 } },
  truncate: { control: { type: 'boolean' } },
  onClick: { action: 'onClick(index)' },
};

const Image = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.4s;

  &:hover {
    transform: rotate(360deg);
  }
`;

export const GalleryGridCustom = ({ images, truncate }) => {
  const imageUrls = new Array(images).fill(0).map((_, i) => `https://cataas.com/cat?${i}`);

  return (
    <UiKitGalleryGrid items={imageUrls} truncate={truncate}>
      {url => <Image key={url} src={url} />}
    </UiKitGalleryGrid>
  );
};

GalleryGridCustom.storyName = 'Custom renderer';

GalleryGridCustom.args = {
  images: 1,
  truncate: false,
};

GalleryGridCustom.argTypes = {
  images: { control: { type: 'number', min: 1, step: 1 } },
  truncate: { control: { type: 'boolean' } },
};
