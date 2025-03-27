/* begin_sample_code
  gistId: 09d7f94cf648d8ac650f72c8b682d667
  gistUrl: https://gist.github.com/amythee/09d7f94cf648d8ac650f72c8b682d667
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/poll-target-selection-page
  filename: PollTargetSelectionPage.tsx
  description: Poll Target Selection Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityPollTargetSelectionPage } from '@amityco/ui-kit';

const SampleAmityPollTargetSelectionPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
      pageBehavior={{
        AmityPollTargetSelectionPageBehavior: {
          goToPollPostComposerPage: (context) => {},
        },
      }}
    >
      <AmityPollTargetSelectionPage />
    </AmityUiKitProvider>
  );
};

export default SampleAmityPollTargetSelectionPage;
/* end_sample_code */
