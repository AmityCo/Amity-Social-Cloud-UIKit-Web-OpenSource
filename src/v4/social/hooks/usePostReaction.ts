import { ReactionRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { set } from 'lodash';
import { useEffect, useState } from 'react';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

interface UsePostReactionParams {
  post: Amity.Post;
}

interface UsePostReactionReturn {
  reactionByMe: string | null;
  reactionsCount: number;
  mutateAddReactionAsync: (reactionKey: string) => Promise<any>;
  mutateRemoveReactionAsync: (reactionKey: string) => Promise<any>;
  setReactionByMe: (reaction: string | null) => void;
}

export const usePostReaction = ({ post }: UsePostReactionParams): UsePostReactionReturn => {
  const [reactionsCount, setReactionsCount] = useState(0);
  const [shouldSubscribe, setShouldSubscribe] = useState(false);
  const [reactionByMe, setReactionByMe] = useState<string | null>(null);
  const { info } = useNotifications();

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
          info({
            content: 'Oops, something went wrong.',
          });
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

    onError: () => {
      setReactionByMe(post?.myReactions?.[0] || null);
      setReactionsCount(post?.reactionsCount || 0);
      info({
        content: 'Oops, something went wrong.',
      });
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

    onError: () => {
      setReactionByMe(post?.myReactions?.[0] || null);
      setReactionsCount(post?.reactionsCount || 0);
      info({
        content: 'Oops, something went wrong.',
      });
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
