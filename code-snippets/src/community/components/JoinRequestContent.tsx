/* begin_sample_code
  gistId: fcbe307f4b30af67ceebe72603066ccb
  gistUrl: https://gist.github.com/amythee/fcbe307f4b30af67ceebe72603066ccb
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-4/social/community/pending-request-page/join-request-content-component
  filename: JoinRequestContent.tsx
  description: Join Request Content Component
*/
import React from 'react';
import { AmityUiKitProvider, AmityJoinRequestContentComponent } from '@amityco/ui-kit';

const SampleAmityJoinRequestContentComponent = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityJoinRequestContentComponent
        pageId={'*'} // optional, default is '*'
        joinRequests={null} // join requests array, can be null
        isLoading={false} // loading state, default is false;
      />
    </AmityUiKitProvider>
  );
};

export default SampleAmityJoinRequestContentComponent;
/* end_sample_code */
