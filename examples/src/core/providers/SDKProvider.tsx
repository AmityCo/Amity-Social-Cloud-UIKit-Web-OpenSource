import React, { ReactNode, createContext, useMemo } from 'react';
import useUser from '../hooks/useUser';

export const SDKContext = createContext<{
  client?: Amity.Client | null;
  currentUserId?: string | null;
  userRoles: string[];
}>({
  client: null,
  currentUserId: undefined,
  userRoles: [],
});

// export const SDKProvider = ({
//   children,
//   client,
// }: {
//   children: ReactNode;
//   client: Amity.Client;
// }) => {
//   const user = useUser(userId);

//   const value = useMemo(
//     () => ({
//       client: client || null,
//       currentUserId: client.userId || undefined,
//       userRoles: user?.roles ?? [],
//     }),
//     [client, user, client.userId],
//   );

//   return <SDKContext.Provider value={value}>{children}</SDKContext.Provider>;
// };
