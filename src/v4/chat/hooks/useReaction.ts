import { ReactionRepository } from '@amityco/ts-sdk';

const useReaction = (referenceType: Amity.ReactableType, referenceId: string) => {
  const addReaction = async (reaction: string) => {
    await ReactionRepository.addReaction(referenceType, referenceId, reaction);
  };

  const removeReaction = async (reaction: string) => {
    await ReactionRepository.removeReaction(referenceType, referenceId, reaction);
  };

  return {
    addReaction,
    removeReaction,
  };
};

export default useReaction;
