/* begin_sample_code
  gistId: 6a2c4c5a70d475151ed7ff920df4dcb7
  gistUrl: https://gist.github.com/amythee/6a2c4c5a70d475151ed7ff920df4dcb7
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/community/community-membership-page
  filename: CommunityMembershipPage.tsx
  description: Community Membership Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityCommunityMembershipPage } from '@amityco/ui-kit';

const SampleAmityCommunityMembershipPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
      pageBehavior={{
        AmityCommunityMembershipPageBehavior: {
          goToAddMemberPage: (context) => {},
          goToUserProfilePage: (context) => {},
        },
      }}
    >
      <AmityCommunityMembershipPage
        community={{}} // community object
      />
    </AmityUiKitProvider>
  );
};

export default SampleAmityCommunityMembershipPage;
/* end_sample_code */
