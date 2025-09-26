/* begin_sample_code
  gistId: 050536a42ab2ebfbc5b6bc243f306f49
  gistUrl: https://gist.github.com/amythee/050536a42ab2ebfbc5b6bc243f306f49
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/post-and-engagement/post-details-page
  filename: PostDetailPage.tsx
  description: Post Detail Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityPostDetailPage } from '@amityco/ui-kit';

const SampleAmityPostDetailPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={config} //put your customized config json object
    >
      <AmityPostDetailPage
        id={} //put your post id
        hideTarget={} //optional boolean to hide target
        category={} //optional post category
        commentId={} //optional comment id to focus on comment
        parentId={} //optional parent id to focus on reply comment
      />
    </AmityUiKitProvider>
  );
};

export default SampleAmityPostDetailPage;
/* end_sample_code */
