import { FeedSourceEnum } from '@amityco/ts-sdk';
import { useState } from 'react';
import { MediaTabType } from '~/v4/social//constants/mediaTabs';
import { CommunityTab } from '~/v4/core/providers/CommunityTabProvider';
import { UserProfileTabs } from '~/v4/social/pages/UserProfilePage/UserProfilePage';

export type LinkToPost = {
  target: 'community' | 'user';
  tab: CommunityTab | UserProfileTabs;
  mediaTab: MediaTabType;
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
