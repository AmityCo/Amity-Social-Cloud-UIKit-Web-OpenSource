import React, { createContext, useCallback, useContext, useState, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { confirm } from '~/core/components/Confirm';
import { PageTypes } from '~/social/constants';

let defaultValue = {};

const defaultAskForConfirmation = ({ onSuccess: onOk, ...params }) =>
  confirm({
    ...params,
    onOk,
  });

export const defaultNavigationBlocker = {
  title: <FormattedMessage id="navigationBlocker.title" />,
  content: <FormattedMessage id="navigationBlocker.content" />,
  okText: <FormattedMessage id="navigationBlocker.okText" />,
};

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
  askForConfirmation = defaultAskForConfirmation,
  children,
  onChangePage: onChangePageProp,
  onClickCategory,
  onClickCommunity,
  onClickUser,
  onCommunityCreated,
  onEditCommunity,
  onEditUser,
  onMessageUser,
}) => {
  const [pages, setPages] = useState([{ type: PageTypes.NewsFeed }]);
  const [navigationBlocker, setNavigationBlocker] = useState();

  const confirmPageChange = useCallback(async () => {
    if (navigationBlocker) {
      // for more info about this, see https://ekoapp.atlassian.net/browse/UP-3462?focusedCommentId=77155
      return new Promise(resolve => {
        askForConfirmation({
          ...navigationBlocker,
          onSuccess: () => {
            setNavigationBlocker(undefined);
            resolve(true);
          },
          onCancel: () => resolve(false),
        });
      });
    }

    return true;
  }, [navigationBlocker]);

  const pushPage = useCallback(
    async newPage => {
      if (!(await confirmPageChange())) return;

      setPages(prevState => [...prevState, newPage]);
    },
    [confirmPageChange],
  );

  const popPage = () => {
    setPages(prevState => (prevState.length > 1 ? prevState.slice(0, -1) : prevState));
  };

  const onChangePage = useMemo(() => {
    if (!onChangePageProp) return undefined;

    return async (...args) => {
      if (!(await confirmPageChange())) return;

      onChangePageProp(args);
    };
  }, [onChangePageProp, confirmPageChange]);

  const handleChangePage = useCallback(
    type => {
      if (onChangePage) return onChangePage({ type });

      pushPage({ type });
    },
    [onChangePage, pushPage],
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
    [onChangePage, onClickCommunity, pushPage],
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
    [onChangePage, onCommunityCreated, pushPage],
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
    [onChangePage, onClickCategory, pushPage],
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
    [onChangePage, onClickUser, pushPage],
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
    [onChangePage, onEditUser, pushPage],
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
    [onChangePage, onEditCommunity, pushPage],
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
        setNavigationBlocker,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};
