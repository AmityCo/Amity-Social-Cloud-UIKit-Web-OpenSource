import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';

interface CommunityFeedTabButtonProps {
  pageId?: string;
  componentId?: string;
}

export const CommunityFeedTabButton = ({
  pageId = '*',
  componentId = '*',
}: CommunityFeedTabButtonProps) => {
  const elementId = 'community_feed_tab_button';
  const { config, accessibilityId, themeStyles, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <div data-qa-anchor={accessibilityId} style={themeStyles}>
      CommunityFeedTabButton
    </div>
  );
};
