/* begin_sample_code
  gistId: 5a57526f43bc41e0113b7ff026843851
  gistUrl: https://gist.github.com/amythee/5a57526f43bc41e0113b7ff026843851
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/post-composer-page/media-attachment-component
  filename: MediaAttachment.tsx
  description: MediaAttachment Component
*/

import React from 'react';
import { AmityUIKitProvider, AmityMediaAttachmentComponent } from '@amityco/ui-kit';

const SampleAmityMediaAttachmentComponent = () => {
  return (
    <AmityUIKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={config} //put your customized config json object
    >
      <AmityMediaAttachmentComponent
        uploadLoading={} //optional //props will refactor in the future
        onChangeImages={() => {}} //optional //props will refactor in the future
        onChangeThumbnail={() => {}} //optional //props will refactor in the future
        videoThumbnail={} //optional //props will refactor in the future
        onChangeVideos={} //optional //props will refactor in the future
        isVisibleCamera={}
        isVisibleImage={}
        isVisibleVideo={}
        totalMedia={} //optional
      />
    </AmityUIKitProvider>
  );
};

export default SampleAmityMediaAttachmentComponent;

/* end_sample_code */
