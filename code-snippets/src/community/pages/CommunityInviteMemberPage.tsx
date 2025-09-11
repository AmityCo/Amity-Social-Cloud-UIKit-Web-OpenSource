/* begin_sample_code
  gistId: fd3e71523967e53393f05785312ae0f7
  gistUrl: https://gist.github.com/amythee/fd3e71523967e53393f05785312ae0f7
  ascPage:
  filename: CommunityInviteMemberPage.tsx
  description: Community Invite Member Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityCommunityInviteMemberPage } from '@amityco/ui-kit';

const SampleAmityCommunityInviteMemberPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityCommunityInviteMemberPage communityId="communityId" onSubmit={(userIds) => {}} />
    </AmityUiKitProvider>
  );
};

export default SampleAmityCommunityInviteMemberPage;
/* end_sample_code */
