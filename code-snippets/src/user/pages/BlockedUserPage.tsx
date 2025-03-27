/* begin_sample_code
  gistId: 59928b755afdc9321a482d65b4edbabe
  gistUrl: https://gist.github.com/amythee/59928b755afdc9321a482d65b4edbabe
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/user/blocked-user-page
  filename: BlockedUserPage.tsx
  description: Blocked User Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityBlockedUserPage } from '@amityco/ui-kit';

const SampleAmityBlockedUserPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
      pageBehavior={{
        AmityBlockedUsersPageBehavior: {
          goToUserProfilePage: (context) => {},
        },
      }}
    >
      <AmityBlockedUserPage />
    </AmityUiKitProvider>
  );
};

export default SampleAmityBlockedUserPage;
/* end_sample_code */
