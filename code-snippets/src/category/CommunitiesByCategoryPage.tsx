/* begin_sample_code
  gistId: 6e80cd67a2974d281ddb11bb4e52092e
  gistUrl: https://gist.github.com/amythee/6e80cd67a2974d281ddb11bb4e52092e
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/communities-by-category-page
  filename: CommunitiesByCategoryPage.tsx
  description: Communities By Category Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityCommunitiesByCategoryPage } from '@amityco/ui-kit';

const SampleAmityCommunitiesByCategoryPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityCommunitiesByCategoryPage categoryId="categoryId" />
    </AmityUiKitProvider>
  );
};

export default SampleAmityCommunitiesByCategoryPage;
/* end_sample_code */
