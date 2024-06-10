import { createContext } from 'react';

export const SDKContext = createContext<{
  client?: Amity.Client | null;
  currentUserId?: string | null;
  userRoles: string[];
}>({
  client: null,
  currentUserId: undefined,
  userRoles: [],
});
