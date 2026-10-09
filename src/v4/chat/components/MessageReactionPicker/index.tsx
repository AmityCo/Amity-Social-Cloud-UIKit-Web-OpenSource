import React from 'react';
import { useFeatureEnabled } from '~/v4/core/providers/CustomizationProvider';
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
  // A reaction surface with no page or component context threaded in, so it
  // asks the module rather than an element id. Switching Reaction off left
  // every one of these drawing: the module has to be off on messages,
  // replies and livestream chat too, not only on posts.
  const reactionEnabled = useFeatureEnabled('reaction');

  const { reactions: config } = useCustomReaction();

  const onClickReaction = (reactionName: AmityReactionType['name']) => {
    selectMessageReaction({ reactionName, message });
  };

  // Asked as a value, not an early return: a hook cannot be skipped. Returning
  // above the hooks below changed the hook count when the module was toggled at
  // runtime, which is what the sample app's Modules screen does.
  if (!reactionEnabled) return null;

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
