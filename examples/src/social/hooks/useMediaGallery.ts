import { PostRepository } from '@amityco/ts-sdk';
import useMediaCollection from './collections/useMediaCollection';

type ElementOf<T> = T extends Array<infer U> ? U : never;

type useMediaGalleryParams = Partial<
  Pick<Parameters<typeof PostRepository.getPosts>[0], 'targetId' | 'targetType' | 'limit'>
> & {
  dataType: ElementOf<Parameters<typeof PostRepository.getPosts>[0]['dataTypes']>;
};

/**
 *
 * @deprecated use useMediaCollection instead
 */
export default function useMediaGallery(params: useMediaGalleryParams) {
  const { media, hasMore, loadMore } = useMediaCollection(params);

  return [media, hasMore, loadMore];
}
