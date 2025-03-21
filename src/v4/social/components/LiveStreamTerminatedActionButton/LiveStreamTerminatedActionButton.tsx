import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/components/AriaButton';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import styles from './LiveStreamTerminatedActionButton.module.css';

type LiveStreamTerminatedActionButtonProps = {
  pageId?: string;
  componentId?: string;
};

export function LiveStreamTerminatedActionButton({
  pageId = '*',
  componentId = '*',
}: LiveStreamTerminatedActionButtonProps) {
  const { onBack } = useNavigation();
  const elementId = 'livestream_terminated_action_button';
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });

  return (
    <Button
      size="medium"
      color="primary"
      style={themeStyles}
      onPress={() => onBack()}
      className={styles.liveStreamTerminatedActionButton}
    >
      OK
    </Button>
  );
}
