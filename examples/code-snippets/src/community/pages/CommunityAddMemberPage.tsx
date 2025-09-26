/* begin_sample_code
  gistId: b8174f575a1b9488a30ac1bf82550120
  gistUrl: https://gist.github.com/amythee/b8174f575a1b9488a30ac1bf82550120
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/community/community-setup-page/add-member-page
  filename: CommunityAddMemberPage.tsx
  description: Community Add Member Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityCommunityAddMemberPage } from '@amityco/ui-kit';

const SampleAmityCommunityAddMemberPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityCommunityAddMemberPage
        member={[]}
        closePopup={() => {}}
        communityId="communityId"
        onAddedAction={(userId) => {}}
      />
    </AmityUiKitProvider>
  );
};

export default SampleAmityCommunityAddMemberPage;
/* end_sample_code */
