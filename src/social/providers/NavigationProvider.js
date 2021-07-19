import React, { createContext, useCallback, useContext, useState } from 'react';
import { PageTypes } from '~/social/constants';

let defaultValue = {};

if (process.env.NODE_ENV !== 'production') {
  defaultValue = {
    page: { type: PageTypes.NewsFeed },
    onChangePage: type => console.log(`NavigationContext onChangePage(${type})`),
    onClickCategory: categoryId => console.log(`NavigationContext onClickCategory(${categoryId})`),
    onClickCommunity: communityId =>
      console.log(`NavigationContext onClickCommunity(${communityId})`),
    onClickUser: userId => console.log(`NavigationContext onClickUser(${userId})`),
    onCommunityCreated: communityId =>
      console.log(`NavigationContext onCommunityCreated(${communityId})`),
    onEditCommunity: communityId =>
      console.log(`NavigationContext onEditCommunity({${communityId})`),
    onEditUser: userId => console.log(`NavigationContext onEditUser(${userId})`),
    onMessageUser: userId => console.log(`NavigationContext onMessageUser(${userId})`),
  };
}

export const NavigationContext = createContext(defaultValue);

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
  const [pages, setPages] = useState([{ type: PageTypes.NewsFeed }]);

  const pushPage = newPage => {
    setPages(prevState => [...prevState, newPage]);
  };

  const popPage = () => {
    setPages(prevState => (prevState.length > 1 ? prevState.slice(0, -1) : prevState));
  };

  const handleChangePage = useCallback(
    type => {
      if (onChangePage) return onChangePage({ type });

      pushPage({ type });
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
      pushPage(next);
    },
    [onChangePage, onClickCommunity],
  );

  const handleCommunityCreated = useCallback(
    communityId => {
      const next = {
        type: PageTypes.CommunityFeed,
        communityId,
        isNewCommunity: true,
      };

      if (onChangePage) return onChangePage(next);
      if (onCommunityCreated) return onCommunityCreated(communityId);

      console.log('handleCommunityCreated', { communityId });
      pushPage(next);
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
      pushPage(next);
    },
    [onChangePage, onClickCategory],
  );

  const handleClickUser = useCallback(
    (userId, pageType) => {
      const next = {
        type: pageType ?? PageTypes.UserFeed,
        userId,
      };

      if (onChangePage) return onChangePage(next);
      if (onClickUser) return onClickUser(userId);

      console.log('handleClickUser', { userId });
      pushPage(next);
    },
    [onChangePage, onClickUser],
  );

  const handleEditUser = useCallback(
    userId => {
      const next = {
        type: PageTypes.UserEdit,
        userId,
      };

      if (onChangePage) return onChangePage(next);
      if (onEditUser) return onEditUser(userId);

      console.log('handleEditUser', { userId });
      pushPage(next);
    },
    [onChangePage, onEditUser],
  );

  const handleEditCommunity = useCallback(
    (communityId, tab) => {
      const next = {
        type: PageTypes.CommunityEdit,
        communityId,
        tab,
      };

      if (onChangePage) return onChangePage(next);
      if (onEditCommunity) return onEditCommunity(communityId, { tab });

      console.log('handleEditCommunity', { communityId, tab });
      pushPage(next);
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
      // pushPage(next);
    },
    [onChangePage, onMessageUser],
  );

  return (
    <NavigationContext.Provider
      value={{
        page: pages[pages.length - 1],
        onChangePage: handleChangePage,
        onClickCategory: handleClickCategory,
        onClickCommunity: handleClickCommunity,
        onClickUser: handleClickUser,
        onCommunityCreated: handleCommunityCreated,
        onEditCommunity: handleEditCommunity,
        onEditUser: handleEditUser,
        onMessageUser: handleMessageUser,
        onBack: popPage,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
