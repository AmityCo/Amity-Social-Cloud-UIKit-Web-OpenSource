/* begin_sample_code
  gistId: f585cf87cebbc5a27ee5e84e0a7bb035
  gistUrl: https://gist.github.com/amythee/f585cf87cebbc5a27ee5e84e0a7bb035
  ascPage:
  filename: CommunityPendingInvitationPage.tsx
  description: Community Pending Invitation Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityCommunityPendingInvitationPage } from '@amityco/ui-kit';

const SampleAmityCommunityPendingInvitationPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityCommunityPendingInvitationPage community={{}} />
    </AmityUiKitProvider>
  );
};

export default SampleAmityCommunityPendingInvitationPage;
/* end_sample_code */
