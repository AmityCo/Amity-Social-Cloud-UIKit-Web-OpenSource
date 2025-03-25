/* begin_sample_code
  gistId: ff49dcc81174831fc3f62007a99b6a6d
  gistUrl: https://gist.github.com/amythee/ff49dcc81174831fc3f62007a99b6a6d
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/community/community-setting-page/community-post-permissions-page
  filename: CommunityPostPermissionPage.tsx
  description: Community Post Permission Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityCommunityPostPermissionPage } from '@amityco/ui-kit';

const SampleAmityCommunityPostPermissionPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityCommunityPostPermissionPage
        community={{}} // community object
      />
    </AmityUiKitProvider>
  );
};

export default SampleAmityCommunityPostPermissionPage;
/* end_sample_code */
