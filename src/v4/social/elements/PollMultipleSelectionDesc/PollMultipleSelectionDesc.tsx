import React from 'react';
import styles from './PollMultipleSelectionDesc.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

type PollMultipleSelectionDescProps = {
  pageId?: string;
  componentId?: string;
};

export const PollMultipleSelectionDesc = ({
  pageId = '*',
  componentId = '*',
}: PollMultipleSelectionDescProps) => {
  const elementId = 'poll_multiple_selection_desc';

  const { config, themeStyles, accessibilityId, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  return (
    <Typography.Caption
      data-testid={accessibilityId}
      style={themeStyles}
      className={styles.pollMultipleSelectionDesc__text}
    >
      {resolveText('amity_social_label_let_participants_vote_more_than_one_option')}
    </Typography.Caption>
  );
};
