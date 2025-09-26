/* begin_sample_code
  gistId: 739aaeeda534db84880a41299e7aec65
  gistUrl: https://gist.github.com/amythee/739aaeeda534db84880a41299e7aec65
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/community/community-setting-page
  filename: CommunitySettingPage.tsx
  description: Community Setting Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityCommunitySettingPage } from '@amityco/ui-kit';

const SampleAmityCommunitySettingPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
      pageBehavior={{
        AmityCommunitySettingPageBehavior: {
          goToEditCommunityPage: (context) => {},
          goToMembershipPage: (context) => {},
          goToPostPermissionPage: (context) => {},
          goToStorySettingPage: (context) => {},
          goToSocialHomePage: () => {},
        },
      }}
    >
      <AmityCommunitySettingPage
        community={{}} // community object
      />
    </AmityUiKitProvider>
  );
};

export default SampleAmityCommunitySettingPage;
/* end_sample_code */
