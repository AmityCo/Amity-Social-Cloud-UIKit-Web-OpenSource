import React from 'react';
import styles from './SettingPage.module.css';
import { CustomSideBarMenuItem } from '~/v4/social/elements/CommunitySideBarMenuItem/CustomSideBarMenuItem';
import { Typography } from '~/v4/core/components';

const menuItems = [
  {
    section: 'Profilo e condivisione',
    items: [
      {
        elementId: 'profile-public',
        text: 'Vedi il tuo profilo pubblico',
        icon: 'User',
      },
      {
        elementId: 'profile-share',
        text: 'Condividi profilo',
        icon: 'Share',
      },
      {
        elementId: 'profile-requests',
        text: 'Gestisci le richieste di seguirti',
        icon: 'UserPlus',
      },
      {
        elementId: 'profile-mention',
        text: 'Menzioni nei post',
        icon: 'AtSign',
      },
    ],
  },
  {
    section: 'Impostazioni',
    items: [
      {
        elementId: 'settings-notifications',
        text: 'Notifiche',
        icon: 'Bell',
      },
      {
        elementId: 'settings-chat',
        text: 'Chat',
        icon: 'MessageCircle',
      },
      {
        elementId: 'settings-comments',
        text: 'Commenti',
        icon: 'MessageSquare',
      },
    ],
  },
  {
    section: 'Restrizioni',
    items: [
      {
        elementId: 'restrictions-blocked',
        text: 'Utenti bloccati',
        icon: 'UserX',
      },
    ],
  },
  {
    section: 'Assistenza e maggiori informazioni',
    items: [
      {
        elementId: 'info-terms',
        text: 'Termini e condizioni',
        icon: 'FileText',
      },
      {
        elementId: 'info-help',
        text: 'Richiedi assistenza',
        icon: 'HelpCircle',
      },
    ],
  },
];

const SettingPage: React.FC = () => {
  return (
    <div className={styles.settingPageContainer}>
      <div className={styles.settingPageContent}>
        {menuItems.map((section, idx) => (
          <React.Fragment key={section.section}>
            <Typography.SubTitleBold className={styles.sectionHeading}>
              {section.section}
            </Typography.SubTitleBold>
            {section.items.map((item) => (
              <CustomSideBarMenuItem
                key={item.elementId}
                elementId={item.elementId}
                text={item.text}
                icon={item.icon}
                onPress={() => {}}
              />
            ))}
            {idx < menuItems.length - 1 && <hr className={styles.sectionDivider} />}
          </React.Fragment>
        ))}
        <div className={styles.deleteProfileContainer}>
          <button className={styles.deleteProfileButton}>Cancella il profilo community</button>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
