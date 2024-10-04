import React from 'react';
import styles from './CommunityCardImage.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Img } from '~/v4/core/natives/Img/Img';
import { People } from '~/v4/icons/People';
import clsx from 'clsx';

const PlaceholderImage = ({ className }: { className?: string }) => {
  return (
    <div className={clsx(styles.communityCardImage__placeholderImage, className)}>
      <People className={styles.communityCardImage__placeholderImageIcon} />
    </div>
  );
};

interface CommunityCardImageProps {
  pageId?: string;
  componentId?: string;
  imgSrc?: string;
  className?: string;
}

export const CommunityCardImage: React.FC<CommunityCardImageProps> = ({
  pageId = '*',
  componentId = '*',
  imgSrc,
  className,
}) => {
  const elementId = 'community_card_image';

  const { themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  return (
    <Img
      data-qa-anchor={accessibilityId}
      style={themeStyles}
      className={clsx(styles.communityCardImage, className)}
      src={imgSrc}
      fallBackRenderer={() => <PlaceholderImage className={className} />}
    />
  );
};
