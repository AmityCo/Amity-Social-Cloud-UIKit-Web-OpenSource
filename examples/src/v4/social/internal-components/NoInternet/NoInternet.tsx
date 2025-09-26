import clsx from 'clsx';
import React, { ComponentProps } from 'react';
import { NoInternetIcon, NoInternetTitle } from '~/v4/social/elements';
import styles from './NoInternet.module.css';

type NoInternetProps = ComponentProps<'div'> & {
  pageId?: string;
  componentId?: string;
};

export const NoInternet = ({
  className,
  pageId = '*',
  componentId = '*',
  ...props
}: NoInternetProps) => {
  return (
    <div {...props} className={clsx(styles.noInternet, className)}>
      <NoInternetIcon pageId={pageId} componentId={componentId} />
      <NoInternetTitle pageId={pageId} componentId={componentId} />
    </div>
  );
};
