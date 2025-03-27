/* begin_sample_code
  gistId: a744aa6b07f01d784bff6841da6c28b7
  gistUrl: https://gist.github.com/amythee/a744aa6b07f01d784bff6841da6c28b7
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/community/pending-post-page
  filename: PendingPostsPage.tsx
  description: Pending Posts Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityPendingPostsPage } from '@amityco/ui-kit';

const SampleAmityPendingPostsPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityPendingPostsPage communityId="communityId" />
    </AmityUiKitProvider>
  );
};

export default SampleAmityPendingPostsPage;
/* end_sample_code */
