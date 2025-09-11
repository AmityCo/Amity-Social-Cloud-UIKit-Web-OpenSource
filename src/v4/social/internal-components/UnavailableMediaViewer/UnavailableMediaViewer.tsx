import React from 'react';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { ClearButton } from '~/v4/social/elements/ClearButton';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import styles from './UnavailableMediaViewer.module.css';
import { FailedImage } from '~/v4/icons/FailedImage';
import { FailedVideo } from '~/v4/icons/FailedVideo';

type UnavailableMediaViewerProps = {
  pageId?: string;
  onClose(): void;
  elementId?: string;
  componentId?: string;
  type?: 'image' | 'video';
};

export function UnavailableMediaViewer({
  onClose,
  pageId = '*',
  elementId = '*',
  componentId = '*',
  type = 'image',
}: UnavailableMediaViewerProps) {
  const { removeDrawerData } = useDrawer();
  const { themeStyles, accessibilityId } = useAmityElement({ pageId, componentId, elementId });

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.unavailableMediaViewer__modal}
    >
      <span className={styles.unavailableMediaViewer__close}>
        <ClearButton
          pageId={pageId}
          onPress={() => {
            onClose();
            removeDrawerData();
          }}
          componentId={componentId}
          defaultClassName={styles.unavailableMediaViewer__closeButton}
          imgClassName={styles.unavailableMediaViewer__closeButton__img}
        />
      </span>
      {type === 'image' && (
        <>
          <div>
            <FailedImage className={styles.unavailableMediaViewer__failedIcon} />
          </div>
          <Typography.Body className={styles.unavailableMediaViewer__failedText}>
            This photo is no longer available.
          </Typography.Body>
        </>
      )}
      {type === 'video' && (
        <>
          <div>
            <FailedVideo className={styles.unavailableMediaViewer__failedIcon} />
          </div>
          <Typography.Body className={styles.unavailableMediaViewer__failedText}>
            This video is no longer available.
          </Typography.Body>
        </>
      )}
    </div>
  );
}
