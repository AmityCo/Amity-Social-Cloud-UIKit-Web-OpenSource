/* begin_sample_code
  gistId: f75758d8e568cba9361da96c79c4bc49
  gistUrl: https://gist.github.com/amythee/f75758d8e568cba9361da96c79c4bc49
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-4/social/community/pending-request-page/pending-post-list-component
  filename: PendingPostList.tsx
  description: Pending Post List Component
*/
import React from 'react';
import { AmityUiKitProvider, AmityPendingPostListComponent } from '@amityco/ui-kit';

const SampleAmityPendingPostListComponent = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityPendingPostListComponent
        pageId={'*'} // optional, default is '*'
        reviewingPosts={[]} // posts array that need to review
        canReviewCommunityPosts={false} // optional boolean to indicate if the user can review community posts
        refresh={() => {}} // optional function to refresh the page
      />
    </AmityUiKitProvider>
  );
};

export default SampleAmityPendingPostListComponent;
/* end_sample_code */
