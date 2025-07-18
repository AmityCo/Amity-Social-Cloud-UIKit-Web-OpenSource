/* begin_sample_code
  gistId: 43c5db0c2f5c455849dfcbafa0303e75
  gistUrl: https://gist.github.com/amythee/43c5db0c2f5c455849dfcbafa0303e75
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/clip/clip-feed-page
  filename: ClipFeedPage.tsx
  description: Clip Feed Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityClipFeedPage } from '@amityco/ui-kit';

const SampleAmityClipFeedPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} //put your customized config json object
      pageBehavior={{
        AmityClipFeedPageBehavior: {
          goToSelectClipPostTargetPage: (context: { isClipPost: true }) => {},
          goToPostDetailPage: (context: {
            postId: 'postId'; // postId string
            targetId: null; // targetId string or null
            targetType: 'user'; // 'user' or 'community'
            community: undefined; // optional community object
          }) => {},
          goToUserProfilePage: (context: {
            userId: 'userId'; // userId string
          }) => {},
          goToCommunityPage: (context: {
            communityId: 'communityId'; // communityId string
          }) => {},
        },
      }}
    >
      <AmityClipFeedPage
        currentPostId="postId" // optional put your current post id that want to focus
        postIndex={0} // optional put your post index that want to focus
        targetType="user" // optional 'user' or 'community'
        targetId={null} // optional put your userId or communityId or null
      />
    </AmityUiKitProvider>
  );
};

export default SampleAmityClipFeedPage;
/* end_sample_code */
