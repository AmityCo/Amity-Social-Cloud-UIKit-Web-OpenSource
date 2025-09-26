/* begin_sample_code
  gistId: 80dd29dbc0fa2b75f5bc362eaa128882
  gistUrl: https://gist.github.com/amythee/80dd29dbc0fa2b75f5bc362eaa128882
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/user/user-profile-page/user-image-feed-component
  filename: UserImageFeed.tsx
  description: User Image Feed Component
*/
import React from 'react';
import { AmityUiKitProvider, AmityUserImageFeedComponent } from '@amityco/ui-kit';

const SampleAmityUserImageFeedComponent = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityUserImageFeedComponent userId="userId" />
    </AmityUiKitProvider>
  );
};

export default SampleAmityUserImageFeedComponent;
/* end_sample_code */
