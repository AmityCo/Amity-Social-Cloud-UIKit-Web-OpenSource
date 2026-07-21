import { createContext } from 'react';

export type SDKContextType = {
  client?: Amity.Client | null;
  currentUserId?: string | null;
  userRoles: string[];
  currentUser?: Amity.User | null;
  isVisitorOrBot: boolean;
  /**
   * Secure-mode auth-token provider passed to AmityUIKitProvider, surfaced here
   * so flows that perform their own login (e.g. CreateUserProfilePage) can reuse
   * it instead of requiring the token callback to be passed again. Optionally
   * receives the resolved userId — useful when the id is minted at login time.
   */
  getAuthToken?: (userId?: string) => Promise<string>;
};

export const initialSDKContext = {
  client: null,
  currentUserId: undefined,
  userRoles: [],
  currentUser: null,
  isVisitorOrBot: false,
  getAuthToken: undefined,
};

export const SDKContext = createContext<SDKContextType>(initialSDKContext);
