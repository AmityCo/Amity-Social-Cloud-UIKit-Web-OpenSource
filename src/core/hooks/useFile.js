import { FileRepository } from 'eko-sdk';
import useLiveObject from '~/core/hooks/useLiveObject';

export default fileId => {
  return useLiveObject(() => FileRepository.fileInformationForId(fileId), []);
};
