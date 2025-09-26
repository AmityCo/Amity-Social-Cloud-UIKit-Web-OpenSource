import clsx from 'clsx';
import React, { FC, ReactElement } from 'react';
import styles from './SheetIcon.module.css';

type SheetIconProps = {
  icon: ReactElement;
  className?: string;
};

export const SheetIcon: FC<SheetIconProps> = ({ icon, className }) => {
  const iconWithProps = React.cloneElement(icon, {
    className: clsx(styles.sheetIcon, className),
  });
  return iconWithProps;
};
