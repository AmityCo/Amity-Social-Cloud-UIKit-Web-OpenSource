/* begin_sample_code
  gistId: 4deb89db7d7f81f2b1ae157df929413e
  gistUrl: https://gist.github.com/amythee/4deb89db7d7f81f2b1ae157df929413e
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/user/user-profile-page/user-profile-header-component
  filename: UserProfileHeader.tsx
  description: User Profile Header Component
*/
import React from 'react';
import { AmityUiKitProvider, AmityUserProfileHeaderComponent } from '@amityco/ui-kit';

const SampleAmityUserProfileHeaderComponent = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
      pageBehavior={{
        AmityUserProfileHeaderComponentBehavior: {
          goToPendingFollowRequestPage: () => {},
          goToUserRelationshipPage: (context) => {},
        },
      }}
    >
      <AmityUserProfileHeaderComponent
        user={{}} // user object
      />
    </AmityUiKitProvider>
  );
};

export default SampleAmityUserProfileHeaderComponent;
/* end_sample_code */
