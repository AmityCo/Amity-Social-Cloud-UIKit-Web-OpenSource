import React from 'react';
import styles from './Drawer.module.css';
import { useDrawer, useDrawerData } from '../../providers/DrawerProvider';
import { Drawer } from 'vaul';

export const DrawerContainer = () => {
  const drawerData = useDrawerData();
  const { removeDrawerData } = useDrawer();

  const isOpen = drawerData != null;

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => open === false && removeDrawerData()}>
      <Drawer.Portal>
        <Drawer.Overlay className={styles.drawer__overlay} />
        <Drawer.Content className={styles.drawer__content}>
          <div className={styles.drawer__innerContent}>
            <div className={styles.drawer__placeholder} />
            {drawerData?.content}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
