import React, { useState, useEffect } from 'react';
import styles from './SettingPage.module.css';
import { CustomSideBarMenuItem } from '~/v4/social/elements/CommunitySideBarMenuItem/CustomSideBarMenuItem';
import { Typography } from '~/v4/core/components';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import FollowersSetting from './partial/FollowersSetting/FollowersSetting';
import ChatSetting from './partial/ChatSetting/ChatSetting';
import CommentSetting from './partial/CommentSetting/CommentSetting';
import BlockedUserSetting from './partial/BlockedUserSetting/BlockedUserSetting';
import MentionSetting from './partial/MentionSetting/MentionSetting';
import SettingTopNavigation from './partial/SettingTopNavigation/SettingTopNavigation';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import useSDK from '~/v4/core/hooks/useSDK';
import BlockedUserSettingTestPage from './partial/BlockedUserSettingTestPage/BlockedUserSettingTestPage';
import { PublicProfilePage } from '~/v4/social/pages/PublicProfilePage';

const menuItems = [
  {
    section: 'Profilo e condivisione',
    items: [
      {
        elementId: 'profile-public',
        text: 'Vedi il tuo profilo pubblico',
        pageTitle: 'Il tuo profilo pubblico',
        icon: 'User',
      },
      {
        elementId: 'profile-share',
        text: 'Condividi profilo',
        icon: 'ShareIcon',
      },
      {
        elementId: 'follower-setting',
        text: 'Gestisci le richieste di seguirti',
        pageTitle: 'Gestisci le richieste di seguirti',
        icon: 'UserSettingsIcon',
      },
      {
        elementId: 'profile-mention',
        text: 'Menzioni nei post',
        pageTitle: 'Post nei quali sei menzionato',
        icon: 'EditIcon',
      },
    ],
  },
  {
    section: 'Impostazioni',
    items: [
      {
        elementId: 'notifications-settings',
        text: 'Notifiche',
        icon: 'NotificationBell',
      },
      {
        elementId: 'chat-settings',
        text: 'Chat',
        pageTitle: 'Impostazioni chat',
        icon: 'ChatBubbleIcon',
      },
      {
        elementId: 'comments-settings',
        text: 'Commenti',
        pageTitle: 'Impostazioni commenti',
        icon: 'ChatBubbleDots',
      },
    ],
  },
  {
    section: 'Restrizioni',
    items: [
      {
        elementId: 'blocked-users',
        text: 'Utenti bloccati',
        icon: 'UserLockIcon',
        pageTitle: 'Utenti bloccati',
      },
      {
        elementId: 'blocked-users-test-page',
        text: 'Utenti bloccati (Test Page)',
        icon: 'UserLockIcon',
        pageTitle: 'Utenti bloccati (Test Page)',
      },
    ],
  },
  {
    section: 'Assistenza e maggiori informazioni',
    items: [
      {
        elementId: 'info-terms',
        text: 'Termini e condizioni',
        icon: 'PageIcon',
      },
      {
        elementId: 'info-help',
        text: 'Richiedi assistenza',
        icon: 'AssistanceIcon',
      },
    ],
  },
];
const SettingPage: React.FC = () => {
  const { openPopup } = usePopupContext();
  const { isDesktop } = useResponsive();
  const [selectedSetting, setSelectedSetting] = useState<string>('settings');

  const handleConfirmDeleteModal = () => {
    const headercontent = <h1>Conferma cancellazione</h1>;
    const bodycontent = <div>Sei sicuro di voler cancellare il tuo profilo?</div>;
    openPopup({
      view: 'desktop',
      header: headercontent,
      children: bodycontent,
    });
  };
  const { currentUserId } = useSDK();
  const currentUser = { userId: currentUserId };

  const handleMenuItemClick = (elementId: string) => {
    setSelectedSetting(elementId);
  };
  const renderChosenSetting = () => {
    switch (selectedSetting) {
      case 'profile-public':
        return <PublicProfilePage userId={currentUser.userId || ''} />;
      case 'profile-share':
        return <div>Profile Share Partial TBD</div>;
      case 'follower-setting':
        return <FollowersSetting />;
      case 'profile-mention':
        return <MentionSetting />;
      case 'notifications-settings':
        return <div>Settings Notifications Partial</div>;
      case 'chat-settings':
        return <ChatSetting />;
      case 'comments-settings':
        return <CommentSetting />;
      case 'blocked-users':
        return <BlockedUserSetting />;
      case 'blocked-users-test-page':
        return <BlockedUserSettingTestPage />;
      case 'info-terms':
        return <div>Info Terms Partial TBD</div>;
      case 'info-help':
        return <div>Info Help Partial TBD</div>;
      default:
        return null;
    }
  };

  const getPageTitle = () => {
    if (selectedSetting === 'settings') return 'Impostazioni';
    for (const section of menuItems) {
      const found = section.items.find((item) => item.elementId === selectedSetting);
      if (found && found.pageTitle) return found.pageTitle;
    }
    return 'Title not yet chosen';
  };

  useEffect(() => {
    if (isDesktop && selectedSetting !== 'settings' && selectedSetting !== 'profile-public') {
      const bodycontent = renderChosenSetting();
      openPopup({
        view: 'desktop',
        header: getPageTitle(),
        children: bodycontent,
        onClose: ({ close }) => {
          setSelectedSetting('settings'); //handle thecorrect function and add it to the onclose popup  with proper service when ready
          close();
        },
      });
      // TODO change it with correct service when ready
      setSelectedSetting('settings');
    }
  }, [selectedSetting, isDesktop]);

  return (
    <div className={styles.settingPageContainer}>
      <div className={styles.settingPageContent}>
        <SettingTopNavigation
          onBackFunc={() => setSelectedSetting('settings')}
          pageTitle={getPageTitle()}
        />
        <div className={styles.partialContainer}>
          {selectedSetting === 'settings' ? (
            <>
              {menuItems.map((section, index) => (
                <React.Fragment key={section.section}>
                  <Typography.BodyBold className={styles.sectionHeading}>
                    {section.section}
                  </Typography.BodyBold>
                  {section.items.map((item) => (
                    <CustomSideBarMenuItem
                      key={item.elementId}
                      elementId={item.elementId}
                      text={item.text}
                      // @ts-ignore
                      icon={item.icon}
                      onPress={() => handleMenuItemClick(item.elementId)}
                    />
                  ))}
                  {index < menuItems.length - 1 && <hr className={styles.sectionDivider} />}
                </React.Fragment>
              ))}
              <div className={styles.deleteProfileContainer} onClick={handleConfirmDeleteModal}>
                <Typography.Body>Cancella il profilo community</Typography.Body>
              </div>
            </>
          ) : selectedSetting === 'profile-public' ? (
            renderChosenSetting()
          ) : (
            !isDesktop && renderChosenSetting()
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
