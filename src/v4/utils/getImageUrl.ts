import { FileRepository } from '@amityco/ts-sdk';
import { FileItem as TFileItem } from '~/v4/social/hooks/useFilePostUpload';
import { isAmityFile } from '~/v4/utils/checkFileType';

export const getImageUrl = ({ file }: TFileItem) => {
  return isAmityFile(file)
    ? FileRepository.fileUrlWithSize(file.fileUrl, 'medium')
    : URL.createObjectURL(file as File); // Add type assertion here
};
