import React from 'react';
import {
  AmityDraftStoryPageProps,
  PlainDraftStoryPage,
} from '~/v4/social/pages/DraftsPage/DraftsPage';
import { PageTypes } from '~/social/constants';
import { useNavigation } from '~/social/providers/NavigationProvider';

export const AmityDraftStoryPage = (props: AmityDraftStoryPageProps) => {
  const { page, onChangePage, onClickCommunity } = useNavigation();

  return (
    <PlainDraftStoryPage
      {...props}
      onDiscardCreateStory={() => {
        if (page.type === PageTypes.DraftPage && page.storyType === 'communityFeed') {
          onClickCommunity(props.targetId);
        } else {
          onChangePage(PageTypes.NewsFeed);
        }
      }}
      goToCommunityPage={(communityId) => onClickCommunity(communityId)}
      goToGlobalFeedPage={() => onChangePage(PageTypes.NewsFeed)}
    />
  );
};

export default AmityDraftStoryPage;
