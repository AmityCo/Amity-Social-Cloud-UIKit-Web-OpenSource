import { PostRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

type ElementOf<T> = T extends Array<infer U> ? U : never;

type useMediaCollectionParams = Partial<
  Pick<Parameters<typeof PostRepository.getPosts>[0], 'targetId' | 'targetType' | 'limit'>
> & {
  dataType: ElementOf<Parameters<typeof PostRepository.getPosts>[0]['dataTypes']>;
};

export default function useMediaCollection({
  targetId,
  targetType,
  dataType,
  limit,
}: useMediaCollectionParams) {
  const { items, ...rest } = useLiveCollection({
    fetcher: PostRepository.getPosts,
    params: {
      targetId: targetId as string,
      targetType,
      dataTypes: [dataType],
      limit,
    },
    shouldCall: () => !!targetId && !!targetType,
  });

  return {
    media: items,
    ...rest,
  };
}
