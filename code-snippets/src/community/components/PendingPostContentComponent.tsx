/* begin_sample_code
  gistId: 4773cac8043d41fdea976ecd9680b7a6
  gistUrl: https://gist.github.com/amythee/4773cac8043d41fdea976ecd9680b7a6
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/community/pending-post-page/pending-post-content-component
  filename: PendingPostContent.tsx
  description: Pending Post Content Component
*/
import React from 'react';
import { AmityUiKitProvider, AmityPendingPostContentComponent } from '@amityco/ui-kit';

const SampleAmityPendingPostContentComponent = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityPendingPostContentComponent
        post={{}} // post object
        refresh={() => {}} // function to refresh
        canReviewCommunityPosts={true} // boolean
      />
    </AmityUiKitProvider>
  );
};

export default SampleAmityPendingPostContentComponent;
/* end_sample_code */
