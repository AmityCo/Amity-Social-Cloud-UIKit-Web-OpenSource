import React, { useState } from 'react';
import { Typography } from '~/v4/core/components/Typography';
import { VideoPreview } from '~/v4/social/internal-components/VideoPreview';
import { useQuery } from '@tanstack/react-query';

import useSDK from '~/v4/core/hooks/useSDK';
import { LinkPreviewSkeleton } from './LinkPreviewSkeleton';
import styles from './LinkPreview.module.css';

const UnableToPreviewSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="36"
    height="27"
    viewBox="0 0 36 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M32.625 0C34.4531 0 36 1.54688 36 3.375V23.625C36 25.5234 34.4531 27 32.625 27H3.375C1.47656 27 0 25.5234 0 23.625V3.375C0 1.54688 1.47656 0 3.375 0H32.625ZM32.2031 23.625C32.4141 23.625 32.625 23.4844 32.625 23.2031V3.79688C32.625 3.58594 32.4141 3.375 32.2031 3.375H3.79688C3.51562 3.375 3.375 3.58594 3.375 3.79688V23.2031C3.375 23.4844 3.51562 23.625 3.79688 23.625H32.2031ZM9 6.1875C10.5469 6.1875 11.8125 7.45312 11.8125 9C11.8125 10.6172 10.5469 11.8125 9 11.8125C7.38281 11.8125 6.1875 10.6172 6.1875 9C6.1875 7.45312 7.38281 6.1875 9 6.1875ZM6.75 20.25V16.875L9.49219 14.1328C9.84375 13.7812 10.3359 13.7812 10.6875 14.1328L13.5 16.875L21.8672 8.50781C22.2188 8.15625 22.7109 8.15625 23.0625 8.50781L29.25 14.625V20.25H6.75Z" />
  </svg>
);

const UnableToPreview = () => (
  <div className={styles.linkPreview__unableToPreview}>
    <UnableToPreviewSvg className={styles.linkPreview__unableToPreview__icon} />
  </div>
);

const usePreviewLink = ({ url }: { url: string }) => {
  const { client } = useSDK();

  return useQuery({
    enabled: !!client,
    queryKey: ['asc-uikit', 'previewLink'],
    queryFn: async () => {
      const data = await client?.http.get<{
        title: 'string';
        description: 'string';
        image: 'string';
        video: 'string';
      }>('/api/v1/link-preview', {
        params: {
          url,
        },
      });

      return data?.data;
    },
    retry: false,
  });
};

interface LinkPreviewProps {
  url: string;
}

export function LinkPreview({ url }: LinkPreviewProps) {
  const urlObject = new URL(url);

  const previewData = usePreviewLink({ url });

  if (previewData.isLoading) {
    return <LinkPreviewSkeleton />;
  }

  const handleClick = () => {
    window.open(url, '_blank');
  };

  if (previewData.isError) {
    return (
      <div onClick={handleClick} className={styles.linkPreview}>
        <div className={styles.linkPreview__top}>
          <UnableToPreview />
        </div>
        <div className={styles.linkPreview__bottom}>
          <Typography.Caption>{urlObject.hostname}</Typography.Caption>
        </div>
      </div>
    );
  }

  return (
    <div onClick={handleClick} className={styles.linkPreview}>
      <div className={styles.linkPreview__top}>
        {previewData.data?.image ? (
          <object data={previewData.data.image} className={styles.linkPreview__object}>
            <UnableToPreview />
          </object>
        ) : (
          <UnableToPreview />
        )}
      </div>
      {previewData.data?.video ? (
        <VideoPreview src={previewData.data.video} />
      ) : (
        <UnableToPreview />
      )}
      <div className={styles.linkPreview__bottom}>
        <Typography.Caption>{urlObject.hostname}</Typography.Caption>
        <Typography.BodyBold>{previewData.data?.title || ''}</Typography.BodyBold>
      </div>
    </div>
  );
}
