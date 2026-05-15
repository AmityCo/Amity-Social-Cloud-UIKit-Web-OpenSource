import React from 'react';
import { TypographyVariant } from '~/v4/core/components';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { Title } from '~/v4/social/elements/Title';
import styles from './LiveStreamBannedPage.module.css';
import { Divider, DividerType } from '~/v4/social/elements/Divider';
import { TextElement } from '~/v4/core/internal-components/TextElement';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { TextButtonElement } from '~/v4/core/internal-components/TextButtonElement/TextButtonElement';
import { IconElement } from '~/v4/core/internal-components/IconElement/IconElement';
import { BannedCaution } from '~/v4/icons/BannedCaution';
import { PAGE_ID } from '~/v4/constants/customization';

export function LiveStreamBannedPage() {
  const pageId = PAGE_ID.LIVESTREAM_BANNED_PAGE;
  const { themeStyles } = useAmityPage({ pageId });
  const { onBack } = useNavigation();
  return (
    <section style={themeStyles} className={styles.liveStreamBannedPage}>
      <div className={styles.liveStreamBannedPage__header}>
        <Title
          pageId={pageId}
          titleClassName={styles.liveStreamBannedPage__title}
          textKey="amity_social_status_banned_page_title"
        />
      </div>
      <Divider type={DividerType.FULL_WIDTH} />
      <div className={styles.liveStreamBannedPage__content}>
        <IconElement
          pageId={pageId}
          elementId="livestream_banned_image"
          defaultIcon={() => <BannedCaution className={styles.liveStreamBannedPage__bannedIcon} />}
          imgIconClassName={styles.liveStreamBannedPage__bannedIcon}
        />
        <TextElement
          pageId={pageId}
          elementId="livestream_banned_title"
          variant={TypographyVariant.Headline}
          className={styles.liveStreamBannedPage__bannedTitle}
        />
        <TextElement
          pageId={pageId}
          elementId="livestream_banned_description"
          variant={TypographyVariant.Body}
          className={styles.liveStreamBannedPage__bannedDescription}
          textKey="amity_social_status_livestream_no_access"
        />
      </div>

      <Divider type={DividerType.FULL_WIDTH} />
      <div className={styles.liveStreamBannedPage__footer}>
        <TextButtonElement
          pageId={pageId}
          elementId="livestream_banned_button"
          color="primary"
          variant="fill"
          className={styles.liveStreamBannedPage__button}
          onPress={() => onBack(1)}
        />
      </div>
    </section>
  );
}
