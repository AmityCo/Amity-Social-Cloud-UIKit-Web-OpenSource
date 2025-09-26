import React from 'react';
import useSDK from '../hooks/useSDK';

/**
 *
 * @deprecated use useSDK instead
 */
const withSDK: any = (Component: any) => (props: any) => {
  const sdkData = useSDK();

  return <Component {...sdkData} {...props} />;
};

export default withSDK;
