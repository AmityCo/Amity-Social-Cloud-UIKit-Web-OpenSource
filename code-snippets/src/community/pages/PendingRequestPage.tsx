/* begin_sample_code
  gistId: 5714e0c048dccde87ed94d5cc8af4e7b
  gistUrl: https://gist.github.com/amythee/5714e0c048dccde87ed94d5cc8af4e7b
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-4/social/community/pending-request-page
  filename: PendingRequestPage.tsx
  description: Pending Request Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityPendingRequestPage } from '@amityco/ui-kit';

const SampleAmityPendingRequestPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityPendingRequestPage
        community={{}} // community object
      />
    </AmityUiKitProvider>
  );
};

export default SampleAmityPendingRequestPage;
/* end_sample_code */
