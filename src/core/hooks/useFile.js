import { FileRepository } from 'eko-sdk';
import useLiveObject from '~/core/hooks/useLiveObject';

export default (fileId, dependencies, resolver) => {
  return useLiveObject(() => FileRepository.fileInformationForId(fileId), dependencies, resolver);
};
