import React, { useEffect } from 'react';
import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { VisitorLimit } from '~/v4/icons/VisitorLimit';
import styles from './VisitorUsageLimitPage.module.css';
import { Button } from '~/v4/core/components/AriaButton';

interface VisitorUsageLimitPageProps {
  onSignIn?: () => void;
}

export const VisitorUsageLimitPage = ({ onSignIn }: VisitorUsageLimitPageProps) => {
  const { info } = useNotifications();
  const title = useString('visitor_usage_limit_title');
  const subtitle = useString('visitor_usage_limit_subtitle');
  const signInLabel = useString('visitor_usage_limit_sign_in');
  const toastContent = useString('visitor_usage_limit_toast');

  // Show toast once on initial mount only
  useEffect(() => {
    handleNoSignIn();
  }, []);

  const handleNoSignIn = () => {
    info({ content: toastContent, alignment: 'fullscreen', duration: 3000 });
  };

  return (
    <div className={styles.visitorUsageLimitPage}>
      <div className={styles.visitorUsageLimitPage__card}>
        <VisitorLimit className={styles.visitorUsageLimitPage__icon} />
        <Typography.TitleBold className={styles.visitorUsageLimitPage__text}>
          {title}
        </Typography.TitleBold>
        <Typography.Caption className={styles.visitorUsageLimitPage__text}>
          {subtitle}
        </Typography.Caption>
        <Button
          className={styles.visitorUsageLimitPage__signInButton}
          onPress={onSignIn ?? handleNoSignIn}
          variant="text"
        >
          <Typography.Body>{signInLabel}</Typography.Body>
        </Button>
      </div>
    </div>
  );
};
