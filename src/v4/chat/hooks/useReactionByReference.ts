import {
  CommentRepository,
  MessageRepository,
  PostRepository,
  StoryRepository,
} from '@amityco/ts-sdk';
import { useEffect, useState } from 'react';

const useReactionByReference = (referenceType: Amity.ReactableType, referenceId: string) => {
  const [reactionCount, setReactionCount] = useState(0);
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [myReaction, setMyReaction] = useState<Amity.Reaction | null>(null);

  const updateReaction = ({
    data,
    loading,
    error,
  }: Amity.LiveObject<Amity.Message | Amity.Comment | Amity.Story | Amity.Post>) => {
    if (loading || error) return;

    setReactionCount(data.reactionsCount);
    setReactions(data.reactions);
    setMyReaction(data.myReaction);
  };

  useEffect(() => {
    if (referenceType === 'message') {
      MessageRepository.getMessage(referenceId, updateReaction);
    } else if (referenceType === 'story') {
      StoryRepository.getStoryByStoryId(referenceId, updateReaction);
    } else if (referenceType === 'comment') {
      CommentRepository.getComment(referenceId, updateReaction);
    } else if (referenceType === 'post') {
      PostRepository.getPost(referenceId, updateReaction);
    } else {
      throw new Error('Unsupported reference type');
    }
  }, [referenceId, referenceType]);

  return {
    reactions,
    reactionCount,
    myReaction,
  };
};

export default useReactionByReference;
