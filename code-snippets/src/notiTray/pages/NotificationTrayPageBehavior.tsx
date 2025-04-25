/* begin_sample_code
  gistId: 67c7a8fe31a6023f4dcee873f5bfa451
  gistUrl: https://gist.github.com/amythee/67c7a8fe31a6023f4dcee873f5bfa451
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/notification-tray
  filename: NotificationTrayPage.tsx
  description: Notification Tray Page Behavior
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
      pageBehavior={{
        AmityNotificationTrayPageBehavior: {
          goToPostDetailPage: ({ postId, hideTarget, category, commentId, parentId }) => {
            console.log('goToPostDetailPage', postId, hideTarget, category, commentId, parentId);
          },
          goToCommunityProfilePage: ({ communityId }) => {
            console.log('goToCommunityProfilePage', communityId);
          },
        },
      }}
    >
      <AmityNotificationTrayPage />
    </AmityUiKitProvider>
  );
};

export default SampleAmityNotificationTrayPage;
/* end_sample_code */
