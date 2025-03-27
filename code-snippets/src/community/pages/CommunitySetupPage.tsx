/* begin_sample_code
  gistId: 399d4f6ab866f6b4d6c10bf620134338
  gistUrl: https://gist.github.com/amythee/399d4f6ab866f6b4d6c10bf620134338
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/community/community-setup-page
  filename: CommunitySetupPage.tsx
  description: Community Setup Page
*/
import React from 'react';
import {
  AmityUiKitProvider,
  AmityCommunitySetupPage,
  AmityCommunitySetupPageMode,
} from '@amityco/ui-kit';

const SampleAmityCommunitySetupPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
      pageBehavior={{
        AmityCommunitySetupPageBehavior: {
          goToAddCategoryPage: (context) => {},
          goToAddMemberPage: (context) => {},
        },
      }}
    >
      <AmityCommunitySetupPage
        mode={AmityCommunitySetupPageMode.EDIT} // create or edit mode
        community={community} // for edit mode, use community object. for create mode, it is not required
      />
    </AmityUiKitProvider>
  );
};

export default SampleAmityCommunitySetupPage;
/* end_sample_code */
