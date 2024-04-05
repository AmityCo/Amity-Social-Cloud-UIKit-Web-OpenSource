import { FileRepository } from '@amityco/ts-sdk';
import { useQuery } from '@tanstack/react-query';

const useFile = <T extends Amity.File>(fileId?: string | null) => {
  const { data: file } = useQuery({
    queryKey: ['asc-uikit', 'FileRepository', 'getFile', fileId],
    queryFn: () => {
      return FileRepository.getFile(fileId as string);
    },
    enabled: !!fileId,
  });

  return file?.data as T | undefined;
};

export default useFile;
