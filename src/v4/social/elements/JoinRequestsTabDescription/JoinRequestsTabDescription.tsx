import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './JoinRequestsTabDescription.module.css';
import { Typography } from '~/v4/core/components';

type JoinRequestsTabDescriptionProps = {
  pageId?: string;
  componentId?: string;
};

export const JoinRequestsTabDescription = ({
  pageId = '*',
  componentId = '*',
}: JoinRequestsTabDescriptionProps) => {
  const elementId = 'join_requests_tab_description';
  const { config, accessibilityId, themeStyles, resolveText } = useAmityElement({
    elementId,
    componentId,
    pageId,
  });

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.joinRequestsTabDescription}
    >
      <Typography.Caption className={styles.joinRequestsTabDescription__text}>
        {resolveText('amity_social_label_declining_a_join_request_is_irreversible_the_user_must_')}
      </Typography.Caption>
    </div>
  );
};
