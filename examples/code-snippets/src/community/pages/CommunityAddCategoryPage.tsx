/* begin_sample_code
  gistId: 44f593af0f439a337f6a057afd014afc
  gistUrl: https://gist.github.com/amythee/44f593af0f439a337f6a057afd014afc
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/community/community-setup-page/add-category-page
  filename: CommunityAddCategoryPage.tsx
  description: Community Add Category Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityCommunityAddCategoryPage } from '@amityco/ui-kit';

const SampleAmityCommunityAddCategoryPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityCommunityAddCategoryPage category={category} />
    </AmityUiKitProvider>
  );
};

export default SampleAmityCommunityAddCategoryPage;
/* end_sample_code */
