import React from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { UIPostAd } from './UIPostAd';
import { useImage } from '~/v4/core/hooks/useImage';

interface PostAdProps {
  pageId?: string;
  ad: Amity.Ad;
}

export const PostAd = ({ pageId = '*', ad }: PostAdProps) => {
  // Ads owned only story_ad. Scoping the feed ad to post_content meant
  // switching Ads off left it on screen, and switching Post off took it away.
  const componentId = 'post_ad';
  const { themeStyles, isExcluded } = useAmityComponent({
    pageId,
    componentId,
  });

  const avatarFile = useImage({ fileId: ad.advertiser?.avatar?.fileId });

  if (isExcluded) return null;
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
