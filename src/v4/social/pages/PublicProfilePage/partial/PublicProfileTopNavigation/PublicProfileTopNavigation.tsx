import React, { useState } from 'react';
import { Typography } from '~/v4/core/components';
import styles from './PublicProfileTopNavigation.module.css';
import ChevronLeft from '~/v4/icons/ChevronLeft';
import { DotsIcon } from '~/icons';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { CustomSideBarMenuItem } from '~/v4/social/elements/CommunitySideBarMenuItem/CustomSideBarMenuItem';
import {
  getProfileMenuItems,
  ProfileMenuItem,
} from '~/v4/social/pages/PublicProfilePage/partial/publicProfileButtonConfig';

type PublicProfileTopNavigationProps = {
  pageTitle?: string;
  onBackFunc?: () => void;
  handleProfileSettings?: () => void;
};

const PublicProfileTopNavigation: React.FC<PublicProfileTopNavigationProps> = ({
  pageTitle,
  onBackFunc,
  handleProfileSettings,
}) => {
  const { isDesktop } = useResponsive();
  const { openPopup } = usePopupContext();
  const [showMenu, setShowMenu] = useState(false);

  // Get menu options from configuration
  const menuOptions = getProfileMenuItems();

  const handleDotsClick = () => {
    if (handleProfileSettings) {
      handleProfileSettings();
    }

    if (isDesktop) {
      // For desktop: Show popup
      openPopup({
        view: 'desktop',
        header: 'Opzioni profilo',
        children: (
          <div className={styles.menuPopup}>
            <Typography.BodyBold className={styles.sectionHeading}>
              Opzioni Profilo
            </Typography.BodyBold>
            <div className={styles.menuItemContainer}>
              {menuOptions.map((item) => (
                <CustomSideBarMenuItem
                  key={item.id}
                  elementId={item.id}
                  text={item.text}
                  // @ts-ignore - Ignoring type error for icon as we know these icons exist
                  icon={item.icon}
                  onPress={item.action}
                />
              ))}
            </div>
          </div>
        ),
      });
    }
  };

  return (
    <div className={styles.topNavigationContainer}>
      <div className={styles.topNavigation}>
        <ChevronLeft width={16} height={16} fill="#000" stroke="#000" onClick={onBackFunc} />

        <span onClick={handleDotsClick}>
          <DotsIcon width={16} height={16} fill="#000" stroke="#000" />
        </span>
      </div>
    </div>
  );
};

export default PublicProfileTopNavigation;
