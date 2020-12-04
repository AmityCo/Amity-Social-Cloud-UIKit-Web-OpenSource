import React, { useState } from 'react';

import UiKitFileLoader from './Loader';
import UiKitUploader from './Uploader';
import Image from '~/core/components/Uploaders/Image';

export default {
  title: 'Ui only/Uploaders',
};

const ImageRenderer = ({ uploading, uploaded }) => {
  const allFiles = [...uploading, ...uploaded];

  return allFiles.map(file => {
    if ('fileId' in file) {
      return <Image src={file.fileUrl} width="100" alt={file.name} />;
    }
    const url = URL.createObjectURL(file);
    return <Image key="blob" src={url} width="100" />;
  });
};

export const SimpleImageUploader = () => {
  const [loadedImages, setLoadedImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);

  return (
    <UiKitFileLoader onChange={images => setLoadedImages(images)}>
      <div
        style={{
          padding: '1em',
          border: '1px dashed #dfdfdf',
          textAlign: 'center',
        }}
      >
        Click/Drop to upload
        <UiKitUploader files={loadedImages} onChange={images => setUploadedImages(images)}>
          <ImageRenderer />
        </UiKitUploader>
      </div>
    </UiKitFileLoader>
  );
};

SimpleImageUploader.storyName = 'Loader';

SimpleImageUploader.args = {
  mimeType: 'image/*',
  multiple: true,
  disabled: false,
};

SimpleImageUploader.argTypes = {
  mimeType: {
    control: {
      type: 'text',
    },
  },
  multiple: {
    control: {
      type: 'boolean',
    },
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  onChange: { action: 'onChange()' },
};
