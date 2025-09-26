import { ReactionRepository } from '@amityco/ts-sdk';
import { AmityReactionType } from '~/v4/core/providers/CustomReactionProvider';

export const selectMessageReaction = async ({
  reactionName,
  message,
}: {
  reactionName: AmityReactionType['name'];
  message: Amity.Message;
}) => {
  const myReactions = message.myReactions || [];

  if (myReactions.includes(reactionName)) {
    await ReactionRepository.removeReaction('message', message.messageId, reactionName);
    return;
  }

  if (myReactions.length > 0) {
    await ReactionRepository.removeReaction('message', message.messageId, myReactions[0]);
  }

  await ReactionRepository.addReaction('message', message.messageId, reactionName);
};
