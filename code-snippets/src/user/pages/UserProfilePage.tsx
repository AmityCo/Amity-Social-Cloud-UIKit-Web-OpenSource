/* begin_sample_code
  gistId: 80609ac73ac07676c6efce16667d6bb3
  gistUrl: https://gist.github.com/amythee/80609ac73ac07676c6efce16667d6bb3
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/user/user-profile-page
  filename: UserProfilePage.tsx
  description: User Profile Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityUserProfilePage } from '@amityco/ui-kit';

const SampleAmityUserProfilePage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
      pageBehavior={{
        AmityUserProfilePageBehavior: {
          goToEditUserPage: (context) => {},
          goToBlockedUsersPage: () => {},
          goToPostComposerPage: (context) => {},
        },
      }}
    >
      <AmityUserProfilePage userId="userId" />
    </AmityUiKitProvider>
  );
};

export default SampleAmityUserProfilePage;
/* end_sample_code */
