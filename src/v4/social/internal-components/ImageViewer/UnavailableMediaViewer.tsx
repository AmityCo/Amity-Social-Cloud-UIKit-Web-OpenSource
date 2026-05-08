import React from 'react';
import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { ClearButton } from '~/v4/social/elements/ClearButton';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import styles from './ImageViewer.module.css';
import { FailedImage } from '~/v4/icons/FailedImage';

type ImageViewerProps = {
  pageId?: string;
  onClose(): void;
  elementId?: string;
  componentId?: string;
  type?: 'image' | 'video';
};

export function ImageViewer({
  onClose,
  pageId = '*',
  elementId = '*',
  componentId = '*',
  type = 'image',
}: ImageViewerProps) {
  const { removeDrawerData } = useDrawer();
  const { themeStyles, accessibilityId } = useAmityElement({ pageId, componentId, elementId });

  return (
    <div style={themeStyles} data-testid={accessibilityId} className={styles.imageViewer__modal}>
      <span className={styles.imageViewer__close}>
        <ClearButton
          pageId={pageId}
          onPress={() => {
            onClose();
            removeDrawerData();
          }}
          componentId={componentId}
          defaultClassName={styles.imageViewer__closeButton}
          imgClassName={styles.imageViewer__closeButton__img}
        />
      </span>
      {type === 'image' && (
        <>
          <div>
            <FailedImage className={styles.imageViewer__failedIcon} />
          </div>
          <Typography.Body className={styles.imageViewer__failedText}>
            {useString('amity_social_label_this_photo_is_no_longer_available')}
          </Typography.Body>
        </>
      )}
    </div>
  );
}
