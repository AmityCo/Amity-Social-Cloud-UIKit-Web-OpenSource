import { useContext } from 'react';
import { SDKContext } from '../providers/SDKProvider';

export const useSDK = () => useContext(SDKContext);

export default useSDK;
