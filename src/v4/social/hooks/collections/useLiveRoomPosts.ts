import { PostRepository } from '@amityco/ts-sdk';
import { useState } from 'react';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';

export default function useLiveRoomPosts({ shouldCall = true }: { shouldCall?: boolean } = {}) {
  const { items, ...rest } = useLiveCollectionV4({
    fetcher: PostRepository.getLiveRoomPosts,
    shouldCall,
  });

  return {
    posts: items,
    ...rest,
  };
}
