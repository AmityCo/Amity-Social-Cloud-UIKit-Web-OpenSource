import React from 'react';
import styled from 'styled-components';

import UiKitGalleryGrid from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only/Gallery Grid',
};

export const GalleryGrid = {
  render: () => {
    const [{ imageAmount, truncate, onClick }] = useArgs();
    const imageUrls = Array(imageAmount)
      .fill(0)
      .map((_, i) => `https://cataas.com/cat?${i}`);
    return <UiKitGalleryGrid items={imageUrls} truncate={truncate} onClick={onClick} />;
  },

  name: 'Default renderer',

  args: {
    imageAmount: 1,
    truncate: false,
  },

  argTypes: {
    imageAmount: { control: { type: 'number', min: 1, step: 1 } },
    truncate: { control: { type: 'boolean' } },
    onClick: { action: 'onClick(index)' },
  },
};

const Image = styled.img.attrs({ loading: 'lazy' })`
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

export const GalleryGridCustom = {
  render: () => {
    const [{ imageAmount, truncate }] = useArgs();
    const imageUrls = Array(imageAmount)
      .fill(0)
      .map((_, i) => `https://cataas.com/cat?${i}`);

    return (
      <UiKitGalleryGrid items={imageUrls} truncate={truncate}>
        {(url) => <Image key={url} src={url} />}
      </UiKitGalleryGrid>
    );
  },

  name: 'Custom renderer',

  args: {
    imageAmount: 1,
    truncate: false,
  },

  argTypes: {
    imageAmount: { control: { type: 'number', min: 1, step: 1 } },
    truncate: { control: { type: 'boolean' } },
  },
};
