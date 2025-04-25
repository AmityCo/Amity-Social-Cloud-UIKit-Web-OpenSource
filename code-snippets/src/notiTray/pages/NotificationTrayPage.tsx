/* begin_sample_code
  gistId: 42d2e9ee57301500c0ff03c843e45437
  gistUrl: https://gist.github.com/amythee/42d2e9ee57301500c0ff03c843e45437
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/notification-tray
  filename: NotificationTrayPage.tsx
  description: Notification Tray Page
*/
import React from 'react';
import { AmityUiKitProvider, AmityNotificationTrayPage } from '@amityco/ui-kit';

const SampleAmityNotificationTrayPage = () => {
  return (
    <AmityUiKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={{}} // put your customized config json object
    >
      <AmityNotificationTrayPage />
    </AmityUiKitProvider>
  );
};

export default SampleAmityNotificationTrayPage;
/* end_sample_code */
