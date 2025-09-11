import { FeedSourceEnum } from '@amityco/ts-sdk';
import { useState } from 'react';
import { CommunityTab } from '~/v4/core/providers/CommunityTabProvider';
import { UserProfileTabs } from '~/v4/social/pages/UserProfilePage/UserProfilePage';

export type LinkToPost = {
  target: 'community' | 'user';
  tab: CommunityTab | UserProfileTabs;
  index: number;
  fileId?: Amity.File['fileId'];
  postId?: string;
  parentPostId?: string;
  feedSources?: FeedSourceEnum[];
};

export function useLinkToPost() {
  const [linkToPost, setLinkToPost] = useState<LinkToPost | null>(null);

  return {
    linkToPost,
    setLinkToPost,
  };
}
