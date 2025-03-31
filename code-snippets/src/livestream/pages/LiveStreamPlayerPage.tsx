/* begin_sample_code
  gistId: 160bd97365296d0dc00365cacb784700
  gistUrl: https://gist.github.com/amythee/160bd97365296d0dc00365cacb784700
  ascPage: ''
  filename: LiveStreamPlayerPage.tsx
  description: Live Stream Player Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityLiveStreamPlayerPage } from '@amityco/ui-kit';

const SampleAmityLiveStreamPlayerPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityLiveStreamPlayerPage
        post={post} // post object
      />
    </AmityUiKitProvider>
  );
};

export default SampleAmityLiveStreamPlayerPage;
/* end_sample_code */
