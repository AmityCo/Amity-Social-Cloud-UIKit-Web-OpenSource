/* begin_sample_code
  gistId: 4892aec489a41f1d9a00d9868544bf22
  gistUrl: https://gist.github.com/amythee/4892aec489a41f1d9a00d9868544bf22
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/all-categories-page
  filename: AllCategoriesPage.tsx
  description: All Categories Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityAllCategoriesPage } from '@amityco/ui-kit';

const SampleAmityAllCategoriesPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityAllCategoriesPage />
    </AmityUiKitProvider>
  );
};

export default SampleAmityAllCategoriesPage;
/* end_sample_code */
