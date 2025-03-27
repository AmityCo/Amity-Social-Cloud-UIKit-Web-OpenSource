/* begin_sample_code
  gistId: ddeb88c8cb42a89c871f6096e8c33a89
  gistUrl: https://gist.github.com/amythee/ddeb88c8cb42a89c871f6096e8c33a89
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/community/community-profile-page/community-image-feed-component
  filename: CommunityImageFeed.tsx
  description: Community Image Feed Component
*/
import React from 'react';
import { AmityUiKitProvider, AmityCommunityImageFeedComponent } from '@amityco/ui-kit';

const SampleAmityCommunityImageFeedComponent = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityCommunityImageFeedComponent communityId="communityId" />
    </AmityUiKitProvider>
  );
};

export default SampleAmityCommunityImageFeedComponent;
/* end_sample_code */
