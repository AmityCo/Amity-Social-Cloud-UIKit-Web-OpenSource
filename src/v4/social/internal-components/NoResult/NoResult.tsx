import clsx from 'clsx';
import React, { ComponentProps } from 'react';
import { NoResultIcon, NoResultTitle } from '~/v4/social/elements';
import styles from './NoResult.module.css';

type NoResultProps = ComponentProps<'div'> & {
  pageId?: string;
  componentId?: string;
};

export const NoResult = ({
  className,
  pageId = '*',
  componentId = '*',
  ...props
}: NoResultProps) => {
  return (
    <div {...props} className={clsx(styles.noResult, className)}>
      <NoResultIcon pageId={pageId} componentId={componentId} />
      <NoResultTitle pageId={pageId} componentId={componentId} />
    </div>
  );
};
