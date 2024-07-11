import React from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit/index';
import useImage from '~/v4/core/hooks/useImage';
import { UICommentAd } from './UICommentAd';

interface CommentAdProps {
  pageId?: string;
  ad: Amity.Ad;
}

export const CommentAd = ({ pageId = '*', ad }: CommentAdProps) => {
  const componentId = 'comment_tray_component';
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
    <UICommentAd
      themeStyles={themeStyles}
      avatarUrl={avatarUrl}
      adImageUrl={adImageUrl}
      ad={ad}
      onCallToActionClick={handleCallToActionClick}
    />
  );
};
