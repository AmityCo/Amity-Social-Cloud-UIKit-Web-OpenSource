import { FileRepository } from '@amityco/ts-sdk';

export function getFileUrlWithSize(
  fileUrl: string,
  size: 'small' | 'medium' | 'large' | 'full' = 'medium',
) {
  return FileRepository.fileUrlWithSize(fileUrl, size);
}
