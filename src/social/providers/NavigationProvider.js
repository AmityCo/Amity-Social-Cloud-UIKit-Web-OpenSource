import React, { createContext, useCallback, useContext, useState } from 'react';
import { PageTypes } from '~/social/constants';

export const NavigationContext = createContext({});

export const useNavigation = () => useContext(NavigationContext);

export default ({
  children,
  onChangePage,
  onClickCategory,
  onClickCommunity,
  onClickUser,
  onCommunityCreated,
  onEditCommunity,
  onEditUser,
  onMessageUser,
}) => {
  const [page, setPage] = useState({ type: PageTypes.NewsFeed });

  const handleChangePage = useCallback(
    type => {
      if (onChangePage) return onChangePage({ type });

      setPage({ type });
    },
    [onChangePage],
  );

  const handleClickCommunity = useCallback(
    communityId => {
      const next = {
        type: PageTypes.CommunityFeed,
        communityId,
      };

      if (onChangePage) return onChangePage(next);
      if (onClickCommunity) return onClickCommunity(communityId);

      console.log('handleClickCommunity', { communityId });
      setPage(next);
    },
    [onChangePage, onClickCommunity],
  );

  const handleCommunityCreated = useCallback(
    communityId => {
      const next = {
        type: PageTypes.CommunityFeed,
        communityId,
      };

      if (onChangePage) return onChangePage(next);
      if (onCommunityCreated) return onCommunityCreated(communityId);

      console.log('handleCommunityCreated', { communityId });
      setPage(next);
    },
    [onChangePage, onCommunityCreated],
  );

  const handleClickCategory = useCallback(
    categoryId => {
      const next = {
        type: PageTypes.Category,
        categoryId,
      };

      if (onChangePage) return onChangePage(next);
      if (onClickCategory) return onClickCategory(categoryId);

      console.log('handleClickCategory', { categoryId });
      setPage(next);
    },
    [onChangePage, onClickCategory],
  );

  const handleClickUser = useCallback(
    userId => {
      const next = {
        type: PageTypes.UserFeed,
        userId,
      };

      if (onChangePage) return onChangePage(next);
      if (onClickUser) return onClickUser(userId);

      console.log('handleClickUser', { userId });
      setPage(next);
    },
    [onChangePage, onClickUser],
  );

  const handleEditUser = useCallback(
    userId => {
      const next = {
        type: 'userSettings',
        userId,
      };

      if (onChangePage) return onChangePage(next);
      if (onEditUser) return onEditUser(userId);

      console.log('handleEditUser', { userId });
    },
    [onChangePage, onEditUser],
  );

  const handleEditCommunity = useCallback(
    communityId => {
      const next = {
        type: PageTypes.CommunityEdit,
        communityId,
      };

      if (onChangePage) return onChangePage(next);
      if (onEditCommunity) return onEditCommunity(communityId);

      console.log('handleEditCommunity', { communityId });
      setPage(next);
    },
    [onChangePage, onEditCommunity],
  );

  const handleMessageUser = useCallback(
    userId => {
      const next = {
        type: 'conversation',
        userId,
      };

      if (onChangePage) return onChangePage(next);
      if (onMessageUser) return onMessageUser(userId);

      console.log('handleMessageUser', { userId });
    },
    [onChangePage, onMessageUser],
  );

  return (
    <NavigationContext.Provider
      value={{
        page,
        onChangePage: handleChangePage,
        onClickCategory: handleClickCategory,
        onClickCommunity: handleClickCommunity,
        onClickUser: handleClickUser,
        onCommunityCreated: handleCommunityCreated,
        onEditCommunity: handleEditCommunity,
        onEditUser: handleEditUser,
        onMessageUser: handleMessageUser,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
