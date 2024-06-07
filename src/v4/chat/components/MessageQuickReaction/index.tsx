import React, { useCallback } from 'react';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { useCustomReaction } from '~/v4/core/providers/CustomReactionProvider';
import { QuickReactionIcon } from '~/v4/icons/QuickReactionIcon';
import { selectMessageReaction } from '~/v4/utils/selectMessageReaction';
import styles from './styles.module.css';

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
  const { config: reactionConfig } = useCustomReaction();
  const { getConfig } = useCustomization();

  const elementConfig = getConfig(`${pageId}/${componentId}/${elementId}`);

  const onClickQuickReaction = useCallback(() => {
    if (
      reactionConfig &&
      elementConfig.reaction &&
      reactionConfig.find((config) => config.name === elementConfig.reaction)
    ) {
      selectMessageReaction({ reactionName: elementConfig.reaction, message });
    }

    onSelectReaction && onSelectReaction();
  }, [reactionConfig, elementConfig, message]);

  return (
    <div className={styles.quickReactionIconContainer}>
      <QuickReactionIcon className={styles.quickReactionIcon} onClick={onClickQuickReaction} />
    </div>
  );
};
