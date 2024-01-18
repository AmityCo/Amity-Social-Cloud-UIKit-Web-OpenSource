import { PostRepository } from '@amityco/js-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

export default function useMediaGallery({ targetId, targetType, dataType, limit }) {
  return useLiveCollection(
    () => PostRepository.queryPosts({ targetId, targetType, dataTypes: [dataType], limit }),
    [targetId, targetType, dataType, limit],
  );
}
