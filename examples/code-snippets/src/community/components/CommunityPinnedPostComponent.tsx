/* begin_sample_code
  gistId: 7b3ef0e7fc9b417eb08ccd68a69a24c8
  gistUrl: https://gist.github.com/amythee/7b3ef0e7fc9b417eb08ccd68a69a24c8
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/community/community-profile-page/community-pin-feed-component
  filename: CommunityPinnedPost.tsx
  description: Community Pinned Post Component
*/
import React from 'react';
import { AmityUiKitProvider, AmityCommunityPinnedPostComponent } from '@amityco/ui-kit';

const SampleAmityCommunityPinnedPostComponent = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityCommunityPinnedPostComponent communityId="communityId" />
    </AmityUiKitProvider>
  );
};

export default SampleAmityCommunityPinnedPostComponent;
/* end_sample_code */
