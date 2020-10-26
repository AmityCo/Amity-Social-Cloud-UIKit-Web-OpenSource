import { FileRepository } from 'eko-sdk';

import useLiveObject from '~/core/hooks/useLiveObject';

const useFile = (fileId, dependencies, resolver) => {
  return useLiveObject(() => FileRepository.fileInformationForId(fileId), dependencies, resolver);
};

export default useFile;
