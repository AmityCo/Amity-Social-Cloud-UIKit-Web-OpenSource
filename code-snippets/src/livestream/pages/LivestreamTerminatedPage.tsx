/* begin_sample_code
  gistId: fa53b87d379436801949259f7789bbcb
  gistUrl: https://gist.github.com/amythee/fa53b87d379436801949259f7789bbcb
  ascPage: ''
  filename: LivestreamTerminatedPage.tsx
  description: Live Stream Terminated Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityLivestreamTerminatedPage } from '@amityco/ui-kit';

const SampleAmityLivestreamTerminatedPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityLivestreamTerminatedPage />
    </AmityUiKitProvider>
  );
};

export default SampleAmityLivestreamTerminatedPage;
/* end_sample_code */
