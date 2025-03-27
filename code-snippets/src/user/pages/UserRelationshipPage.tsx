/* begin_sample_code
  gistId: 90d4380a3e79822dffb6138f7d565520
  gistUrl: https://gist.github.com/amythee/90d4380a3e79822dffb6138f7d565520
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/user/user-relationship-page
  filename: UserRelationshipPage.tsx
  description: User Relationship Page
*/
import React from 'react';
import {
  AmityUiKitProvider,
  AmityUserRelationshipPage,
  AmityUserRelationshipPageTabs,
} from '@amityco/ui-kit';

const SampleAmityUserRelationshipPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
      pageBehavior={{
        AmityUserRelationshipPageBehavior: {
          goToUserProfilePage: (context) => {},
        },
      }}
    >
      <AmityUserRelationshipPage
        userId="userId"
        selectedTab={AmityUserRelationshipPageTabs.FOLLOWING} // or AmityUserRelationshipPageTabs.FOLLOWER
      />
    </AmityUiKitProvider>
  );
};

export default SampleAmityUserRelationshipPage;
/* end_sample_code */
