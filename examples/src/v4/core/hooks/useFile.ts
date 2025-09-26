import { FileRepository } from '@amityco/ts-sdk';
import { useQuery } from '@tanstack/react-query';

const useFile = <T extends Amity.FileType = any>(fileId?: string | null) => {
  const { data: file } = useQuery({
    queryKey: ['asc-uikit', 'FileRepository', 'getFile', fileId],
    queryFn: () => {
      return FileRepository.getFile<T>(fileId as string);
    },
    enabled: !!fileId,
  });

  return file?.data as Amity.File<T> | undefined;
};

export default useFile;
