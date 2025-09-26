import { PostRepository, getPostTopic } from '@amityco/ts-sdk';
import useSubscription from './useSubscription';

export default function usePostSubscription({
  postId,
  level,
  shouldSubscribe = true,
  callback,
}: {
  postId?: string | null;
  level: Parameters<typeof getPostTopic>[1];
  shouldSubscribe?: boolean;
  callback?: Amity.Listener;
}) {
  return useSubscription({
    fetcher: PostRepository.getPost,
    params: postId,
    callback,
    shouldSubscribe: !!postId && shouldSubscribe,
    getSubscribedTopic: ({ data: post }) => getPostTopic(post, level),
  });
}
