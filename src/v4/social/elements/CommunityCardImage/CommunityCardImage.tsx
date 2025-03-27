import clsx from 'clsx';
import { People } from '~/v4/icons/People';
import { Img } from '~/v4/core/natives/Img/Img';
import React, { ComponentPropsWithoutRef } from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import styles from './CommunityCardImage.module.css';

type CommunityCardImageProps = {
  imgSrc?: string;
  pageId?: string;
  className?: string;
  componentId?: string;
};

export const CommunityCardImage = ({
  imgSrc,
  className,
  pageId = '*',
  componentId = '*',
}: CommunityCardImageProps) => {
  const elementId = 'community_card_image';
  const { themeStyles, accessibilityId } = useAmityElement({ pageId, componentId, elementId });

  return (
    <Img
      src={imgSrc}
      style={themeStyles}
      data-testid={accessibilityId}
      alt="Placeholder Community Cover"
      className={clsx(styles.communityCardImage, className)}
      fallBackRenderer={() => <PlaceholderImage className={className} />}
    />
  );
};

const PlaceholderImage = ({ className }: ComponentPropsWithoutRef<'div'>) => {
  return (
    <div className={clsx(styles.communityCardImage__placeholderImage, className)}>
      <People className={styles.communityCardImage__placeholderImageIcon} />
    </div>
  );
};
