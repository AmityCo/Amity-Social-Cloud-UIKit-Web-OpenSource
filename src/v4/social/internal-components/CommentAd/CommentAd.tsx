import React from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { UICommentAd } from './UICommentAd';
import { useImage } from '~/v4/core/hooks/useImage';

interface CommentAdProps {
  pageId?: string;
  ad: Amity.Ad;
}

export const CommentAd = ({ pageId = '*', ad }: CommentAdProps) => {
  // Same as the feed ad: scoped to the comment tray, so it followed Comment
  // rather than Ads.
  const componentId = 'comment_ad';
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
    <UICommentAd
      themeStyles={themeStyles}
      avatarUrl={avatarUrl}
      adImageUrl={adImageUrl}
      ad={ad}
      onCallToActionClick={handleCallToActionClick}
    />
  );
};
