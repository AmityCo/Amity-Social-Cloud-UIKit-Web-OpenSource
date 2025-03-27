/* begin_sample_code
  gistId: fe40c747b516250f2555bc1e92f1a069
  gistUrl: https://gist.github.com/amythee/fe40c747b516250f2555bc1e92f1a069
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/community/community-setting-page/community-story-setting-page
  filename: CommunityStorySettingPage.tsx
  description: Community Story Setting Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityCommunityStorySettingPage } from '@amityco/ui-kit';

const SampleAmityCommunityStorySettingPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityCommunityStorySettingPage
        community={{}} // community object
      />
    </AmityUiKitProvider>
  );
};

export default SampleAmityCommunityStorySettingPage;
/* end_sample_code */
