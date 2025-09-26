import React from 'react';
import styles from './PublicProfileOptions.module.css';
import { CustomSideBarMenuItem } from '~/v4/social/elements/CommunitySideBarMenuItem/CustomSideBarMenuItem';
import { Typography } from '~/v4/core/components';
import { getProfileMenuItems } from '~/v4/social/pages/PublicProfilePage/partial/publicProfileButtonConfig';

type PublicProfileOptionsProps = {
  onFollowUser?: () => void;
  onReportUser?: () => void;
  onShareProfile?: () => void;
  onBlockUser?: () => void;
};

const PublicProfileOptions: React.FC<PublicProfileOptionsProps> = () => {
  const menuItems = getProfileMenuItems();

  return (
    <div className={styles.publicProfileOptions}>
      <Typography.BodyBold className={styles.sectionHeading}>Opzioni Profilo</Typography.BodyBold>
      <div className={styles.menuItemContainer}>
        {menuItems.map((item) => (
          <CustomSideBarMenuItem
            key={item.id}
            elementId={item.id}
            text={item.text}
            // @ts-ignore
            icon={item.icon}
            onPress={item.action}
          />
        ))}
      </div>
    </div>
  );
};

export default PublicProfileOptions;
