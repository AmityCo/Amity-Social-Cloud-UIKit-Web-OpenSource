/* begin_sample_code
  gistId: 5e74e8bee36a3c71fac2cff3490581c4
  gistUrl: https://gist.github.com/amythee/5e74e8bee36a3c71fac2cff3490581c4
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/user/edit-user-profile-page
  filename: EditUserProfilePage.tsx
  description: Edit User Profile Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityEditUserProfilePage } from '@amityco/ui-kit';

const SampleAmityEditUserProfilePage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityEditUserProfilePage userId="userId" />
    </AmityUiKitProvider>
  );
};

export default SampleAmityEditUserProfilePage;
/* end_sample_code */
