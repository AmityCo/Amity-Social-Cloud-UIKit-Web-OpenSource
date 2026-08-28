import { ReactionRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { set } from 'lodash';
import { useEffect, useState } from 'react';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { resolveString } from '~/v4/core/localization';
import { ERROR_RESPONSE } from '~/v4/social/constants/errorResponse';

interface UsePostReactionParams {
  post: Amity.Post;
  onDeletedPost?: () => void;
}

interface UsePostReactionReturn {
  reactionByMe: string | null;
  reactionsCount: number;
  mutateAddReactionAsync: (reactionKey: string) => Promise<any>;
  mutateRemoveReactionAsync: (reactionKey: string) => Promise<any>;
  setReactionByMe: (reaction: string | null) => void;
}

const isDeletedPostError = (error: unknown): boolean =>
  error instanceof Error && error.message.includes(ERROR_RESPONSE.DELETED_POST);

export const usePostReaction = ({
  post,
  onDeletedPost,
}: UsePostReactionParams): UsePostReactionReturn => {
  const [reactionsCount, setReactionsCount] = useState(0);
  const [shouldSubscribe, setShouldSubscribe] = useState(false);
  const [reactionByMe, setReactionByMe] = useState<string | null>(null);
  const { info } = useNotifications();

  const handleReactionError = (error: unknown) => {
    if (isDeletedPostError(error) && onDeletedPost) {
      onDeletedPost();
      return;
    }
    info({
      content: resolveString('amity_social_toast_failed_generic'),
    });
  };

  useEffect(() => {
    if (post == null) return;
    setReactionByMe(post.myReactions?.[0] || null);
  }, [post?.myReactions]);

  useEffect(() => {
    if (post == null) return;
    setReactionsCount(post?.reactionsCount || 0);
  }, [post?.reactionsCount]);

  const { mutateAsync: mutateAddReactionAsync } = useMutation({
    mutationFn: async (reactionKey: string) => {
      if (reactionByMe && reactionByMe !== reactionKey) {
        try {
          setReactionByMe(reactionKey);
          await ReactionRepository.removeReaction('post', post?.postId, reactionByMe);
        } catch (err) {
          setReactionByMe(post?.myReactions?.[0] || null);
          handleReactionError(err);
        }
      }
      return ReactionRepository.addReaction('post', post?.postId, reactionKey);
    },

    onMutate: (reactionKey) => {
      setShouldSubscribe(true);
      if (!reactionByMe) {
        setReactionsCount(reactionsCount + 1);
      }
    },

    onError: (error) => {
      setReactionByMe(post?.myReactions?.[0] || null);
      setReactionsCount(post?.reactionsCount || 0);
      handleReactionError(error);
    },
  });

  const { mutateAsync: mutateRemoveReactionAsync } = useMutation({
    mutationFn: async (reactionKey: string) => {
      setReactionByMe(null);
      return ReactionRepository.removeReaction('post', post?.postId, reactionKey);
    },
    onMutate: () => {
      setShouldSubscribe(true);
      setReactionsCount(Math.max(0, reactionsCount - 1));
    },

    onError: (error) => {
      setReactionByMe(post?.myReactions?.[0] || null);
      setReactionsCount(post?.reactionsCount || 0);
      handleReactionError(error);
    },
  });

  return {
    reactionByMe,
    reactionsCount,
    mutateAddReactionAsync,
    mutateRemoveReactionAsync,
    setReactionByMe,
  };
};
