/* begin_sample_code
  gistId: c4ed8f55453c6e243e1108c5934ee8e9
  gistUrl: https://gist.github.com/amythee/c4ed8f55453c6e243e1108c5934ee8e9
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/clip/clip-post-creation-page/draft-clip-page
  filename: DraftClipPage.tsx
  description: Draft Clip Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityDraftClipPage } from '@amityco/ui-kit';

const SampleAmityDraftClipPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} //put your customized config json object
      pageBehavior={{
        AmityDraftClipPageBehavior: {
          goToPostComposerPage: (context: {
            mode: 'create';
            targetId: null; // targetId string or null
            targetType: 'user'; // 'user' or 'community'
            community: undefined; // optional community object
            isClipPost: true; // true for clip post
          }) => {},
        },
      }}
    >
      <AmityDraftClipPage
        targetId={null} //put your target id or null
        targetType="user"
        community={undefined} //optional community object
      />
    </AmityUiKitProvider>
  );
};

export default SampleAmityDraftClipPage;
/* end_sample_code */
