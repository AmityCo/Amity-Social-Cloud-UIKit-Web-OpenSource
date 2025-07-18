/* begin_sample_code
  gistId: a023c4269ab36b9c275eea31a131cae2
  gistUrl: https://gist.github.com/amythee/a023c4269ab36b9c275eea31a131cae2
  ascPage: ''
  filename: LiveStreamBannedPage.tsx
  description: Live Stream Banned Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityLiveStreamBannedPage } from '@amityco/ui-kit';

const SampleAmityLivestreamBannedPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityLiveStreamBannedPage />
    </AmityUiKitProvider>
  );
};

export default SampleAmityLivestreamBannedPage;
/* end_sample_code */
