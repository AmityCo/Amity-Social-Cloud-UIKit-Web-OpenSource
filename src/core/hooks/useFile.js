import { FileRepository } from 'eko-sdk';

import useLiveObject from '~/core/hooks/useLiveObject';

const useFile = (fileId, dependencies = [fileId], resolver = undefined) => {
  return useLiveObject(() => FileRepository.fileInformationForId(fileId), dependencies, resolver);
};

export default useFile;
