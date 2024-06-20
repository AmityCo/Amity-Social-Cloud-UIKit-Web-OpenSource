import React from 'react';
import {
  AmityDraftStoryPageProps,
  PlainDraftStoryPage,
} from '~/v4/social/pages/DraftsPage/DraftsPage';
import { PageTypes } from '~/social/constants';
import { useNavigation } from '~/social/providers/NavigationProvider';

export const AmityDraftStoryPage = (props: AmityDraftStoryPageProps) => {
  const { onChangePage, onClickCommunity } = useNavigation();

  return (
    <PlainDraftStoryPage
      {...props}
      onDiscardCreateStory={() => onChangePage(PageTypes.NewsFeed)}
      goToCommunityPage={(communityId) => onClickCommunity(communityId)}
      goToGlobalFeedPage={() => onChangePage(PageTypes.NewsFeed)}
      storyType={props.storyType}
    />
  );
};

export default AmityDraftStoryPage;
