/* begin_sample_code
  gistId: d89d6e5d28da58faf66ab03ce6c47ffd
  gistUrl: https://gist.github.com/amythee/d89d6e5d28da58faf66ab03ce6c47ffd
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/community/community-profile-page/community-video-feed-component
  filename: CommunityVideoFeed.tsx
  description: Community Video Feed Component
*/
import React from 'react';
import { AmityUiKitProvider, AmityCommunityVideoFeedComponent } from '@amityco/ui-kit';

const SampleAmityCommunityVideoFeedComponent = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityCommunityVideoFeedComponent communityId="communityId" />
    </AmityUiKitProvider>
  );
};

export default SampleAmityCommunityVideoFeedComponent;
/* end_sample_code */
