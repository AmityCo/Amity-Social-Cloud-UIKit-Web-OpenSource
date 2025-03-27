/* begin_sample_code
  gistId: 384d1c6b19a403ba18e75461a1978524
  gistUrl: https://gist.github.com/amythee/384d1c6b19a403ba18e75461a1978524
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/poll-post-composer-page
  filename: PollPostComposerPage.tsx
  description: Poll Post Composer Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityPollPostComposerPage } from '@amityco/ui-kit';

const SampleAmityPollPostComposerPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityPollPostComposerPage
        targetId="targetId" // string | null
        targetType="community" // 'community' | 'user'
      />
    </AmityUiKitProvider>
  );
};

export default SampleAmityPollPostComposerPage;
/* end_sample_code */
