import { FileRepository } from '@amityco/ts-sdk';
import useFetcher from './useFetcher';

const useFile = <T extends Amity.File>(fileId?: string | null) => {
  const file = useFetcher({
    fetchFn: FileRepository.getFile,
    params: [fileId] as [string],
    shouldCall: () => !!fileId,
  });

  return file?.data as T;
};

export default useFile;
