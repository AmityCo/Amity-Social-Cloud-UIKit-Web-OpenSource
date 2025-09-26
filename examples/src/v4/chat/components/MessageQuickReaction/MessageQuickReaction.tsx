import React, { useCallback } from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { AmityReactionType, useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';
import { QuickReactionIcon } from '~/v4/icons/QuickReactionIcon';
import { selectMessageReaction } from '~/v4/utils/selectMessageReaction';
import styles from './MessageQuickReaction.module.css';

interface MessageQuickReactionProps {
  pageId?: string;
  componentId?: string;
  message: Amity.Message;
  onSelectReaction?: () => void;
}

export const MessageQuickReaction = ({
  pageId = '*',
  componentId = '*',
  message,
  onSelectReaction,
}: MessageQuickReactionProps) => {
  const elementId = 'message_quick_reaction';

  const { config } = useAmityElement({ pageId, componentId, elementId });
  const { config: reactionConfig } = useCustomReaction();

  const onClickQuickReaction = useCallback(() => {
    if (
      reactionConfig &&
      config.reaction &&
      reactionConfig.find((reaction) => reaction.name === config.reaction)
    ) {
      selectMessageReaction({
        reactionName: config.reaction as AmityReactionType['name'],
        message,
      });
    }

    onSelectReaction && onSelectReaction();
  }, [reactionConfig, config, message]);

  return (
    <div className={styles.quickReactionIconContainer}>
      <QuickReactionIcon className={styles.quickReactionIcon} onClick={onClickQuickReaction} />
    </div>
  );
};
