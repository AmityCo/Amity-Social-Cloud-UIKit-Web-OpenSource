/* begin_sample_code
  gistId: d70b8b63bb26958f88ec6eb5857f0623
  gistUrl: https://gist.github.com/amythee/d70b8b63bb26958f88ec6eb5857f0623
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
    >
      <AmitySocialHomePage />
    </AmityUiKitProvider>
  );
};

export default SampleAmitySocialHomePage;
/* end_sample_code */
