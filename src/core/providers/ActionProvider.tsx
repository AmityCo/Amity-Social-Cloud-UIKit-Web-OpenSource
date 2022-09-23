import React, { createContext, useContext, useMemo } from 'react';

export type ActionEvents = {
  onCommunityCreate: (params: { communityId: string; name: string; isPrivate: string }) => void;
  onCommunityClose: (params: { communityId: string }) => void;
  onCommunityJoin: (params: { communityId: string }) => void;
  onCommunityLeave: (params: { communityId: string }) => void;
  onPostCreate: (params: { postId: string }) => void;
  onPostImpression: (params: { postId: string }) => void;
};

export type ActionContextProps = {
  actionHandlers: Partial<ActionEvents>;
  children: React.ReactNode;
};

const ActionContext = createContext<Partial<ActionEvents>>({});

export const useConfig = () => useContext(ActionContext);

/** Provide action events, passed from the app. Used for analytics. */
export default ({ children, actionHandlers }: ActionContextProps) => {
  const value = useMemo(() => actionHandlers, [actionHandlers]);

  return <ActionContext.Provider value={value}>{children}</ActionContext.Provider>;
};

/** Use action events, passed from the app. Used for analytics. */
export const useActionEvents = () => useContext(ActionContext);
