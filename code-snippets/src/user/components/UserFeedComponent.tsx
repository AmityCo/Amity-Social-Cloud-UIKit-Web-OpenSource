/* begin_sample_code
  gistId: a1cdc46547c1c11b876afeffc9d9a70e
  gistUrl: https://gist.github.com/amythee/a1cdc46547c1c11b876afeffc9d9a70e
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/user/user-profile-page/user-feed-component
  filename: UserFeed.tsx
  description: User Feed Component
*/
import React from 'react';
import { AmityUiKitProvider, AmityUserFeedComponent } from '@amityco/ui-kit';

const SampleAmityUserFeedComponent = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
      pageBehavior={{
        AmityUserFeedComponentBehavior: {
          goToPostDetailPage: (context) => {},
        },
      }}
    >
      <AmityUserFeedComponent userId="userId" />
    </AmityUiKitProvider>
  );
};

export default SampleAmityUserFeedComponent;
/* end_sample_code */
