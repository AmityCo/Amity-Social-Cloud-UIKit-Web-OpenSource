/* begin_sample_code
  gistId: abd8cfcd6c0c3b899d3ced73c50428bc
  gistUrl: https://gist.github.com/amythee/abd8cfcd6c0c3b899d3ced73c50428bc
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/discover-and-search/social-home-page
  filename: SocialHomePage.tsx
  description: Social Home Page
*/

import React from 'react';
import { AmityUiKitProvider, AmitySocialHomePage } from '@amityco/ui-kit';

const SampleAmitySocialHomePage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={config} //put your customized config json object
      pageBehavior={{
        AmitySocialHomePageBehavior: {
          goToNotificationTrayPage: () => {
            console.log('goToNotificationTrayPage');
          },
        },
      }}
    >
      <AmitySocialHomePage />
    </AmityUiKitProvider>
  );
};

export default SampleAmitySocialHomePage;
/* end_sample_code */
