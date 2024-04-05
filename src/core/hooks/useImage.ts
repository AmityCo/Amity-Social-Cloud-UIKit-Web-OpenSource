import { useEffect, useState } from 'react';
import { FileRepository } from '@amityco/ts-sdk';
import useFile from './useFile';

interface UseImageProps {
  fileId?: string | null;
  imageSize?: 'small' | 'medium' | 'large' | 'full';
}

const useImage = ({ fileId, imageSize = 'medium' }: UseImageProps) => {
  const file = useFile(fileId);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (file == null || fileId == null) {
      setImageUrl(undefined);
      return;
    }

    async function run() {
      if (file?.fileUrl == null) return;
      const newImageUrl = FileRepository.fileUrlWithSize(file?.fileUrl, imageSize);
      setImageUrl(newImageUrl);
    }
    run();
  }, [file, imageSize]);

  return imageUrl;
};

export default useImage;
