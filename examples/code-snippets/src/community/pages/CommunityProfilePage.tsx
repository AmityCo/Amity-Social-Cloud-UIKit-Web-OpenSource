/* begin_sample_code
  gistId: db38f1c0021364e0da2162d20af7924b
  gistUrl: https://gist.github.com/amythee/db38f1c0021364e0da2162d20af7924b
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/community/community-profile-page
  filename: CommunityProfilePage.tsx
  description: Community Profile Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityCommunityProfilePage } from '@amityco/ui-kit';

const SampleAmityCommunityProfilePage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
      pageBehavior={{
        AmityCommunityProfilePageBehavior: {
          goToPostComposerPage: (context) => {},
          goToPostDetailPage: (context) => {},
          goToStoryCreationPage: (context) => {},
          goToCommunitySettingPage: (context) => {},
          goToEditCommunityPage: (context) => {},
          goToPendingPostPage: (context) => {},
          goToMembershipPage: (context) => {},
          goToPollPostComposerPage: (context) => {},
        },
      }}
    >
      <AmityCommunityProfilePage communityId="communityId" />
    </AmityUiKitProvider>
  );
};

export default SampleAmityCommunityProfilePage;
/* end_sample_code */
