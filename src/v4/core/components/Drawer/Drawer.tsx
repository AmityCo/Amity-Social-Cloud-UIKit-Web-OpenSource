import React, { useEffect, useMemo, useState, type CSSProperties } from 'react';
import styles from './Drawer.module.css';
import { useDrawer, useDrawerData } from '~/v4/core/providers/DrawerProvider';
import { Drawer } from 'vaul';

export const DrawerContainer = () => {
  const drawerData = useDrawerData();
  const { removeDrawerData } = useDrawer();

  const isOpen = drawerData != null;
  const { snapPoints, activeSnapPoint, onSnapPointChange, ariaLabel } = drawerData || {};

  const [internalSnap, setInternalSnap] = useState<string | number | null>(
    activeSnapPoint ?? snapPoints?.[0] ?? null,
  );

  useEffect(() => {
    setInternalSnap(activeSnapPoint ?? snapPoints?.[0] ?? null);
  }, [drawerData]);

  const handleSnapPointChange = (snapPoint: string | number | null) => {
    setInternalSnap(snapPoint);
    if (onSnapPointChange) {
      onSnapPointChange(snapPoint);
    }
  };

  const visibleHeight = useMemo(() => {
    if (typeof internalSnap === 'number')
      return `${Math.min(Math.max(internalSnap, 0), 1) * 100}vh`;
    if (typeof internalSnap === 'string') return internalSnap;
    return '100vh';
  }, [internalSnap]);

  const contentStyle = { '--asc-drawer-visible-height': visibleHeight } as CSSProperties;

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(open) => open === false && removeDrawerData()}
      {...(snapPoints && { snapPoints, activeSnapPoint: internalSnap })}
      setActiveSnapPoint={handleSnapPointChange}
      modal={true}
      dismissible={true}
    >
      <Drawer.Portal>
        <Drawer.Overlay className={styles.drawer__overlay} />
        <Drawer.Content
          aria-label={ariaLabel || 'Drawer'}
          className={styles.drawer__content}
          style={contentStyle}
        >
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
