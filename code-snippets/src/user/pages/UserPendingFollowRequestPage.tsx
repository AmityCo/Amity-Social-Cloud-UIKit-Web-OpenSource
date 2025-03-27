/* begin_sample_code
  gistId: d4da25b391911e4752236b92de290f49
  gistUrl: https://gist.github.com/amythee/d4da25b391911e4752236b92de290f49
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/user/user-pending-follow-request-page
  filename: UserPendingFollowRequestPage.tsx
  description: User Pending Follow Request Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityUserPendingFollowRequestPage } from '@amityco/ui-kit';

const SampleAmityUserPendingFollowRequestPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
      pageBehavior={{
        AmityUserPendingFollowRequestsPageBehavior: {
          goToUserProfilePage: (context) => {},
        },
      }}
    >
      <AmityUserPendingFollowRequestPage />
    </AmityUiKitProvider>
  );
};

export default SampleAmityUserPendingFollowRequestPage;
/* end_sample_code */
