import React from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { UIPostAd } from './UIPostAd';
import { useImage } from '~/v4/core/hooks/useImage';

interface PostAdProps {
  pageId?: string;
  ad: Amity.Ad;
}

export const PostAd = ({ pageId = '*', ad }: PostAdProps) => {
  const componentId = 'post_content';
  const { themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });

  const avatarFile = useImage({ fileId: ad.advertiser?.avatar?.fileId });
  const avatarUrl = avatarFile || ad.advertiser?.avatar?.fileUrl || '';

  const adImageFile = useImage({ fileId: ad.image1_1?.fileId });
  const adImageUrl = adImageFile || ad.image1_1?.fileUrl || '';

  const handleCallToActionClick = (link: string) => {
    window?.open(link, '_blank');
  };

  return (
    <UIPostAd
      themeStyles={themeStyles}
      avatarUrl={avatarUrl}
      adImageUrl={adImageUrl}
      ad={ad}
      onCallToActionClick={handleCallToActionClick}
    />
  );
};
