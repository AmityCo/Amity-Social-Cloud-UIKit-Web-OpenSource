import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './InvitationSectionTitle.module.css';

type InvitationSectionTitleProps = {
  pageId?: string;
  componentId?: string;
};

export const InvitationSectionTitle = ({
  pageId = '*',
  componentId = '*',
}: InvitationSectionTitleProps) => {
  const elementId = 'invitation_section_title';
  const { accessibilityId, isExcluded, config } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.CaptionBold
      as="h2"
      data-testid={accessibilityId}
      className={styles.invitationSectionTitle}
    >
      {config.text}
    </Typography.CaptionBold>
  );
};
