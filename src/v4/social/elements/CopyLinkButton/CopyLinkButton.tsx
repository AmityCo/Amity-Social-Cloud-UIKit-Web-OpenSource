import React from 'react';
import { IconButton } from '~/v4/core/components/IconButton';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { CopyToClipboard } from '~/v4/icons/CopyToClipboard';
import { SharableModel } from '~/v4/utils/sharableLink';
import { useSharableLink } from '~/v4/social/hooks/useSharableLink';
import styles from './CopyLinkButton.module.css';
import { NotificationAlignment } from '~/v4/core/components/Notification';

interface CopyLinkButtonProps {
  pageId?: string;
  componentId?: string;
  model: SharableModel;
  referenceId?: string;
  notificationAlignment?: NotificationAlignment;
  onDone?: () => void;
}

export const CopyLinkButton = ({
  pageId = '*',
  componentId = '*',
  model,
  referenceId,
  notificationAlignment,
  onDone,
}: CopyLinkButtonProps) => {
  const notification = useNotifications();
  const elementId = 'copy_link';

  const { link, isLoading } = useSharableLink({
    model,
    referenceId,
  });

  if (!link || isLoading) return null;

  return (
    <IconButton
      className={styles.copyLinkButton__button}
      pageId={pageId}
      componentId={componentId}
      elementId={elementId}
      variant="text"
      defaultIcon={<CopyToClipboard className={styles.copyLinkButton__icon} />}
      onPress={() => {
        navigator.clipboard.writeText(link);
        notification.success({ content: 'Link copied', alignment: notificationAlignment });
        onDone?.();
      }}
      typographyVariant="bodyBold"
    />
  );
};
