import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconButton } from '~/v4/core/components/IconButton';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { CopyToClipboard } from '~/v4/icons/CopyToClipboard';
import { AmitySharableContentType } from '@amityco/ts-sdk';
import { useSharableLink } from '~/v4/social/hooks/useSharableLink';
import styles from './CopyLinkButton.module.css';
import { NotificationAlignment } from '~/v4/core/components/Notification';
import { resolveString } from '~/v4/core/localization';

interface CopyLinkButtonProps {
  pageId?: string;
  componentId?: string;
  textId?: string;
  model: AmitySharableContentType;
  referenceId?: string;
  notificationAlignment?: NotificationAlignment;
  onDone?: () => void;
}

export const CopyLinkButton = ({
  pageId = '*',
  componentId = '*',
  textId = 'amity_social_label_copy_post_link',
  model,
  referenceId,
  notificationAlignment,
  onDone,
}: CopyLinkButtonProps) => {
  const notification = useNotifications();
  const elementId = 'copy_link';
  const { resolveText } = useAmityElement({ pageId, componentId, elementId });

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
        notification.success({
          content: resolveString('amity_social_button_link_copied'),
          alignment: notificationAlignment,
        });
        onDone?.();
      }}
      text={resolveText(textId)}
      typographyVariant="bodyBold"
    />
  );
};
