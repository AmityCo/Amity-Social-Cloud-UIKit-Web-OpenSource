import React from 'react';
import { ImageIconButton } from './ImageIconButton';
import Liked from '~/v4/icons/Liked';

export default {
  title: 'v4/social/internal-components/ImageIconButton',
};

export const ImageIconButtonStory = {
  render: () => {
    return <ImageIconButton defaultIcon={() => <Liked />} />;
  },
};
