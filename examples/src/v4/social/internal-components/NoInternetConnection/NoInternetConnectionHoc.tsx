import clsx from 'clsx';
import { useNetworkState } from 'react-use';
import React, { useEffect } from 'react';
import { NoInternetConnection, NoInternetConnectionProps } from './NoInternetConnection';
import styles from './NoInternetConnectionHoc.module.css';

type NoInternetConnectionHocProps = NoInternetConnectionProps & {
  page?: 'feed' | 'global-search';
  children: React.ReactNode;
  refresh?: () => void;
};

export const NoInternetConnectionHoc = ({
  page,
  children,
  className,
  refresh,
  ...props
}: NoInternetConnectionHocProps) => {
  const { online } = useNetworkState();

  useEffect(() => {
    online && refresh?.();
  }, [online]);

  return online ? (
    <>{children}</>
  ) : (
    <div className={clsx(styles.noInternetConnectionHoc, className)} data-page={page}>
      <NoInternetConnection {...props} />
    </div>
  );
};
