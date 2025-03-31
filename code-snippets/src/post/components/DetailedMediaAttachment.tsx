/* begin_sample_code
  gistId: 5c8e04686cd2f5e2fcfba25f976b1e8c
  gistUrl: https://gist.github.com/amythee/5c8e04686cd2f5e2fcfba25f976b1e8c
  ascPage: https://docs.social.plus/social-plus-uikit/uikit-v4/social/post-composer-page/detailed-media-attachment-component
  filename: DetailedMediaAttachment.tsx
  description: DetailedMediaAttachment Component
*/

import React from 'react';
import { AmityUIKitProvider, AmityDetailedMediaAttachmentComponent } from '@amityco/ui-kit';

const SampleAmityDetailedMediaAttachmentComponent = () => {
  return (
    <AmityUIKitProvider
      apiKey="API_KEY"
      apiRegion="API_REGION"
      userId="userId"
      displayName="displayName"
      configs={config} //put your customized config json object
    >
      <AmityDetailedMediaAttachmentComponent
        uploadLoading={} //optional //props will refactor in the future
        onChangeImages={() => {}} //optional //props will refactor in the future
        onChangeThumbnail={} //optional //props will refactor in the future
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

export default SampleAmityDetailedMediaAttachmentComponent;

/* end_sample_code */
