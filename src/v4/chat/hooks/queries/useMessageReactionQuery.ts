import { useMutation } from '@tanstack/react-query';
import { ReactionRepository } from '@amityco/ts-sdk';

export type MessageReactionPayload = {
  message: Amity.Message;
  reactionName: string;
};

export type UseMessageReactionQueryReturn = {
  addReaction: (payload: MessageReactionPayload) => Promise<void>;
  removeReaction: (payload: MessageReactionPayload) => Promise<void>;
  selectReaction: (payload: MessageReactionPayload) => Promise<void>;
};

export function useMessageReactionQuery(): UseMessageReactionQueryReturn {
  const { mutateAsync: addMutateAsync } = useMutation<boolean, Error, MessageReactionPayload>({
    mutationFn: ({ message, reactionName }) => {
      return message.addReaction(reactionName);
    },
    onError: (_error, { message, reactionName }) => {
      ReactionRepository.removeReaction.optimistically('message', message.messageId, reactionName);
    },
  });

  const { mutateAsync: removeMutateAsync } = useMutation<boolean, Error, MessageReactionPayload>({
    mutationFn: ({ message, reactionName }) => {
      return message.removeReaction(reactionName);
    },
    onError: (_error, { message, reactionName }) => {
      ReactionRepository.addReaction.optimistically('message', message.messageId, reactionName);
    },
  });

  async function addReaction(payload: MessageReactionPayload): Promise<void> {
    await addMutateAsync(payload);
  }

  async function removeReaction(payload: MessageReactionPayload): Promise<void> {
    await removeMutateAsync(payload);
  }

  async function selectReaction({ message, reactionName }: MessageReactionPayload): Promise<void> {
    if (!message.messageId) return;

    const myReactions = message.myReactions ?? [];
    const isAlreadySelected = myReactions.includes(reactionName);

    if (isAlreadySelected) {
      await removeReaction({ message, reactionName });
      return;
    }

    if (myReactions.length > 0) {
      await removeReaction({ message, reactionName: myReactions[0] });
    }
    ReactionRepository.addReaction.optimistically('message', message.messageId, reactionName);
    await addReaction({ message, reactionName });
  }

  return { addReaction, removeReaction, selectReaction };
}
