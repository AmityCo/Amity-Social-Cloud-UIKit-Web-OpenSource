import { useMemo } from 'react';
import { ImageSize, FileRepository } from '@amityco/js-sdk';

const useImage = ({ fileId, imageSize = ImageSize.Medium }) => {
  const url = useMemo(() => {
    if (!fileId) return;

    return FileRepository.getFileUrlById({
      fileId,
      imageSize,
    });
  }, [fileId, imageSize]);

  return url;
};

export default useImage;
