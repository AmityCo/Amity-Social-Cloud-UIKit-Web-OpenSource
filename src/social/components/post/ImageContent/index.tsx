import React from 'react';
import Image from '~/core/components/Uploaders/Image';

interface ImageContentProps {
  fileId: string;
}

const ImageContent = ({ fileId }: ImageContentProps) => <Image fileId={fileId} />;

export default ImageContent;
