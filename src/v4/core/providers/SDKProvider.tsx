import { createContext } from 'react';

export type SDKContextType = {
  client?: Amity.Client | null;
  currentUserId?: string | null;
  userRoles: string[];
  currentUser?: Amity.User | null;
  isVisitorOrBot: boolean;
};

export const initialSDKContext = {
  client: null,
  currentUserId: undefined,
  userRoles: [],
  currentUser: null,
  isVisitorOrBot: false,
};

export const SDKContext = createContext<SDKContextType>(initialSDKContext);
