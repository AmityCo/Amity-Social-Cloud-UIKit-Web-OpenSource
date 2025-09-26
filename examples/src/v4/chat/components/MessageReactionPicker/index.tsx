import React from 'react';
import { AmityReactionType, useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';
import { selectMessageReaction } from '~/v4/utils/selectMessageReaction';
import styles from './styles.module.css';

export const MessageReactionPicker = ({
  message,
  onSelectReaction,
}: {
  message: Amity.Message;
  onSelectReaction: (reactionName: string) => void;
}) => {
  const { config } = useCustomReaction();

  const onClickReaction = (reactionName: AmityReactionType['name']) => {
    selectMessageReaction({ reactionName, message });
  };

  if (!config) return null;

  return (
    <div className={styles.reactionPickerContainer}>
      {config.map((reaction) => {
        return (
          <img
            data-active={message.myReactions?.includes(reaction.name)}
            key={reaction.name}
            src={reaction.image}
            alt={reaction.name}
            className={styles.reactionButton}
            onClick={() => {
              onClickReaction(reaction.name);
              onSelectReaction && onSelectReaction(reaction.name);
            }}
          />
        );
      })}
    </div>
  );
};
