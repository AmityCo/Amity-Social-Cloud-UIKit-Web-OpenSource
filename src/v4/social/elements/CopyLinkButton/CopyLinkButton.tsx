import React, { useEffect, useState } from 'react';
import { IconButton } from '~/v4/core/components/IconButton';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { CopyToClipboard } from '~/v4/icons/CopyToClipboard';
import { getShareableLink, SharableModel } from '~/v4/utils/sharableLink';
import styles from './CopyLinkButton.module.css';

interface CopyLinkButtonProps {
  pageId?: string;
  componentId?: string;
  model: SharableModel;
  referenceId?: string;
  onDone?: () => void;
}

export const CopyLinkButton = ({
  pageId = '*',
  componentId = '*',
  model,
  referenceId,
  onDone,
}: CopyLinkButtonProps) => {
  const notification = useNotifications();
  const elementId = 'copy_link';

  const [link, setLink] = useState<string>();

  useEffect(() => {
    if (!referenceId) return;

    getShareableLink({
      model,
      referenceId,
    }).then((result) => setLink(result));
  }, [referenceId]);

  if (!link) return null;

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
        notification.success({ content: 'Link copied' });
        onDone?.();
      }}
      typographyVariant="bodyBold"
    />
  );
};
