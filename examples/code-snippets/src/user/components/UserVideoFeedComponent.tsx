/* begin_sample_code
  gistId: 8f0d776ca262523a3162b1f56464b21d
  gistUrl: https://gist.github.com/amythee/8f0d776ca262523a3162b1f56464b21d
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/user/user-profile-page/user-video-feed-component
  filename: UserVideoFeed.tsx
  description: User Video Feed Component
*/
import React from 'react';
import { AmityUiKitProvider, AmityUserVideoFeedComponent } from '@amityco/ui-kit';

const SampleAmityUserVideoFeedComponent = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityUserVideoFeedComponent userId="userId" />
    </AmityUiKitProvider>
  );
};

export default SampleAmityUserVideoFeedComponent;
/* end_sample_code */
