import { CommentRepository, getCommentTopic } from '@amityco/ts-sdk';
import useSubscription from './useSubscription';

export default function useCommentSubscription({
  commentId,
  shouldSubscribe = () => true,
  callback,
}: {
  commentId?: string | null;
  shouldSubscribe?: () => boolean;
  callback?: Amity.Listener;
}) {
  return useSubscription({
    fetcher: CommentRepository.getComment,
    params: commentId,
    callback,
    shouldSubscribe: () => !!commentId && shouldSubscribe(),
    getSubscribedTopic: ({ data: comment }) => getCommentTopic(comment),
  });
}
