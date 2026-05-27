import React from 'react';
import styles from './Drawer.module.css';
import { useDrawer, useDrawerData } from '~/v4/core/providers/DrawerProvider';
import { Drawer } from 'vaul';

export const DrawerContainer = () => {
  const drawerData = useDrawerData();
  const { removeDrawerData } = useDrawer();

  const isOpen = drawerData != null;
  const { snapPoints, activeSnapPoint, onSnapPointChange, ariaLabel } = drawerData || {};

  const handleSnapPointChange = (snapPoint: string | number | null) => {
    if (onSnapPointChange) {
      onSnapPointChange(snapPoint);
    }
  };

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => open === false && removeDrawerData()}
      {...(snapPoints && { snapPoints })}
      {...(activeSnapPoint !== undefined && { activeSnapPoint })}
      setActiveSnapPoint={handleSnapPointChange}
      modal={true}
      dismissible={true}
      repositionInputs={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay className={styles.drawer__overlay} />
        <Drawer.Content aria-label={ariaLabel || 'Drawer'} className={styles.drawer__content}>
          <Drawer.Title className={styles.drawer__title}>{ariaLabel || 'Drawer'}</Drawer.Title>
          <Drawer.Description className={styles.drawer__title}>
            {ariaLabel || 'Drawer'}
          </Drawer.Description>
          <div className={styles.drawer__innerContent}>
            <div className={styles.drawer__placeholder} />
            {drawerData?.content}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
