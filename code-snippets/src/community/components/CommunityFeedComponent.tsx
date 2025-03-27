/* begin_sample_code
  gistId: 9d8a38f20904941d0ce8af50a80bf4c3
  gistUrl: https://gist.github.com/amythee/9d8a38f20904941d0ce8af50a80bf4c3
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/community/community-profile-page/community-feed-component
  filename: CommunityFeed.tsx
  description: Community Feed Component
*/
import React from 'react';
import { AmityUiKitProvider, AmityCommunityFeedComponent } from '@amityco/ui-kit';

const SampleAmityCommunityFeedComponent = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityCommunityFeedComponent communityId="communityId" />
    </AmityUiKitProvider>
  );
};

export default SampleAmityCommunityFeedComponent;
/* end_sample_code */
