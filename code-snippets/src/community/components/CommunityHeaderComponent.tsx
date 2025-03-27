/* begin_sample_code
  gistId: f901b6be37fd7e40d63c2436c9d002fd
  gistUrl: https://gist.github.com/amythee/f901b6be37fd7e40d63c2436c9d002fd
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/community/community-profile-page/community-header-component
  filename: CommunityHeader.tsx
  description: Community Header Component
*/
import React from 'react';
import { AmityUiKitProvider, AmityCommunityHeaderComponent } from '@amityco/ui-kit';

const SampleAmityCommunityHeaderComponent = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityCommunityHeaderComponent
        community={{}} // community object
      />
    </AmityUiKitProvider>
  );
};

export default SampleAmityCommunityHeaderComponent;
/* end_sample_code */
