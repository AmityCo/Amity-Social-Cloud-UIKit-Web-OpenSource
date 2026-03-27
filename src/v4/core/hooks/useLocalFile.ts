import { FileRepository } from '@amityco/ts-sdk';
import { useQuery } from '@tanstack/react-query';

const useLocalFile = <T extends Amity.File>(fileId?: string | null) => {
  const { data: file } = useQuery({
    queryKey: ['asc-uikit', 'FileRepository', 'getLocalFile', fileId],
    queryFn: () => {
      return FileRepository.getFile.locally(fileId as string);
    },
    enabled: !!fileId,
  });

  return file?.data as T | undefined;
};

export default useLocalFile;
