import React from 'react';
import styles from './CommunityRowImage.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Img } from '~/v4/core/natives/Img/Img';
import { CommunityPlaceholderIcon } from '~/v4/icons/CommunityPlaceholderIcon';

interface CommunityRowImageProps {
  pageId?: string;
  componentId?: string;
  imgSrc?: string;
}

export const CommunityRowImage: React.FC<CommunityRowImageProps> = ({
  pageId = '*',
  componentId = '*',
  imgSrc,
}) => {
  const elementId = 'community_row_image';

  const { themeStyles, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  // Owned by a module. A reusable element can be rendered on any page,
  // including one another module owns, so it answers for itself.
  if (isExcluded) return null;

  return (
    <Img
      style={themeStyles}
      className={styles.communityRowImage__img}
      src={imgSrc}
      fallBackRenderer={() => (
        <div className={styles.communityRowImage__placeholder} style={themeStyles}>
          <CommunityPlaceholderIcon className={styles.communityRowImage__placeholderIcon} />
        </div>
      )}
    />
  );
};
