import { useContext } from 'react';
import { SDKContext } from '~/v4/core/providers/SDKProvider';

export const useSDK = () => useContext(SDKContext);

export default useSDK;
