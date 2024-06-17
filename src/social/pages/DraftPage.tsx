import React from 'react';
import {
  AmityDraftStoryPageProps,
  PlainDraftStoryPage,
} from '~/v4/social/pages/DraftsPage/DraftsPage';
import { PageTypes } from '../constants';
import { useNavigation } from '../providers/NavigationProvider';

export const AmityDraftStoryPage = (props: AmityDraftStoryPageProps) => {
  const { onChangePage, onClickCommunity } = useNavigation();

  return (
    <PlainDraftStoryPage
      {...props}
      onDiscardCreateStory={() => onChangePage(PageTypes.NewsFeed)}
      goToCommunityPage={(communityId) => onClickCommunity(communityId)}
      goToGlobalFeedPage={() => onChangePage(PageTypes.NewsFeed)}
    />
  );
};

export default AmityDraftStoryPage;
