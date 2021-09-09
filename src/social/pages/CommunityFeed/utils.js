import { toHumanString } from 'human-readable-numbers';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { CommunityFeedTabs } from './constants';

export function getTabs(needApprovalOnPostCreation, isJoined, canReview, pendingPostCount = 0) {
  const tabs = [
    { value: CommunityFeedTabs.TIMELINE, label: <FormattedMessage id="tabs.timeline" /> },
    { value: CommunityFeedTabs.GALLERY, label: <FormattedMessage id="tabs.gallery" /> },
    { value: CommunityFeedTabs.MEMBERS, label: <FormattedMessage id="tabs.members" /> },
  ];

  if (isJoined && needApprovalOnPostCreation) {
    const amount = canReview ? pendingPostCount : 0;

    tabs.push({
      value: CommunityFeedTabs.PENDING,
      label: (
        <FormattedMessage
          id="tabs.pendingPosts"
          values={{ amount, formattedAmount: toHumanString(amount) }}
        />
      ),
    });
  }

  return tabs;
}
