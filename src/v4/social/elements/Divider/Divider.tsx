import React, { ComponentPropsWithoutRef } from 'react';
import styles from './Divider.module.css';
import clsx from 'clsx';
import { Typography } from '~/v4/core/components';

export const enum DividerType {
  POST = 'post',
  FULL_WIDTH = 'fullWidth',
  CONTENT = 'content',
  ALPHABET = 'alphabet',
}

type DividerProps = ComponentPropsWithoutRef<'div'> & {
  isShown?: boolean;
  type?: DividerType;
  alphabet?: string;
};

export function Divider({
  isShown = true,
  type = DividerType.POST,
  className,
  alphabet,
}: DividerProps) {
  return isShown ? (
    <div className={clsx(styles.divider, className)} data-type={type}>
      {alphabet && (
        <Typography.BodyBold className={styles.divider__alphabet}>{alphabet}</Typography.BodyBold>
      )}
    </div>
  ) : null;
}
