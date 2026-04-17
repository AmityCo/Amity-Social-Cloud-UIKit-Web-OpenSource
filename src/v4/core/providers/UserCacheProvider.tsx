import React, { createContext, useCallback, useContext, useState, ReactNode } from 'react';

type UserCacheContextType = {
  users: Record<string, Amity.User>;
  setUser: (userId: string, user: Amity.User) => void;
};

const UserCacheContext = createContext<UserCacheContextType>({
  users: {},
  setUser: () => {},
});

export const useUserCache = () => useContext(UserCacheContext);

export function UserCacheProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<Record<string, Amity.User>>({});

  const setUser = useCallback((userId: string, user: Amity.User) => {
    setUsers((prev) => ({ ...prev, [userId]: user }));
  }, []);

  return (
    <UserCacheContext.Provider value={{ users, setUser }}>{children}</UserCacheContext.Provider>
  );
}
