import React from 'react';
import { PAGE_ID } from '~/v4/constants/customization';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import ChevronLeft from '~/v4/icons/ChevronLeft';
import NoCamera from '~/v4/icons/NoCamera';
import styles from './LivestreamUnsupportedPage.module.css';

export function LivestreamUnsupportedPage() {
  const pageId = PAGE_ID.LIVESTREAM_UNSUPPORTED_PAGE;
  const { themeStyles } = useAmityPage({ pageId });
  const { onBack } = useNavigation();

  return (
    <section style={themeStyles} className={styles.livestreamUnsupportedPage}>
      <Button
        variant="default"
        className={styles.livestreamUnsupportedPage__backButton}
        onPress={() => onBack()}
      >
        <ChevronLeft className={styles.livestreamUnsupportedPage__backIcon} />
      </Button>
      <div>
        <Typography.TitleBold className={styles.livestreamUnsupportedPage__text}>
          Live streaming isn't available on mobile browsers.
        </Typography.TitleBold>
        <Typography.Caption className={styles.livestreamUnsupportedPage__text}>
          Please use the desktop site or mobile app to start your live stream.
        </Typography.Caption>
      </div>
    </section>
  );
}
