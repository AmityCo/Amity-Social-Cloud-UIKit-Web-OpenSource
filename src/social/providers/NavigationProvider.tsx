import React, { createContext, useCallback, useContext, useState, useMemo, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { confirm } from '~/core/components/Confirm';
import { PageTypes } from '~/social/constants';

type Page =
  | {
      type: PageTypes.Explore | PageTypes.NewsFeed;
      communityId?: string;
    }
  | {
      type: PageTypes.CommunityFeed;
      communityId: string;
      isNewCommunity: boolean;
    }
  | {
      type: PageTypes.CommunityEdit;
      communityId: string;
      tab: string;
    }
  | {
      type: PageTypes.Category;
      categoryId: string;
      communityId?: string;
    }
  | {
      type: PageTypes.UserFeed | PageTypes.UserEdit;
      userId: string;
      communityId?: string;
    };

type ContextValue = {
  page: Page;
  onChangePage: (type: string) => void;
  onClickCategory: (categoryId: string) => void;
  onClickCommunity: (communityId: string) => void;
  onClickUser: (userId: string, pageType?: string) => void;
  onCommunityCreated: (communityId: string) => void;
  onEditCommunity: (communityId: string, tab?: string) => void;
  onEditUser: (userId: string) => void;
  onMessageUser: (userId: string) => void;
  onBack: () => void;
  setNavigationBlocker?: (
    params:
      | {
          title: ReactNode;
          content: ReactNode;
          okText: ReactNode;
        }
      | null
      | undefined,
  ) => void;
};

let defaultValue: ContextValue = {
  page: { type: PageTypes.NewsFeed, communityId: undefined },
  onChangePage: (type: string) => {},
  onClickCategory: (categoryId: string) => {},
  onClickCommunity: (communityId: string) => {},
  onClickUser: (userId: string) => {},
  onCommunityCreated: (communityId: string) => {},
  onEditCommunity: (communityId: string) => {},
  onEditUser: (userId: string) => {},
  onMessageUser: (userId: string) => {},
  setNavigationBlocker: () => {},
  onBack: () => {},
};

const defaultAskForConfirmation = ({ onSuccess: onOk, ...params }: { onSuccess: () => void }) =>
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
    page: { type: PageTypes.NewsFeed, communityId: undefined },
    onChangePage: (type) => console.log(`NavigationContext onChangePage(${type})`),
    onClickCategory: (categoryId) =>
      console.log(`NavigationContext onClickCategory(${categoryId})`),
    onClickCommunity: (communityId) =>
      console.log(`NavigationContext onClickCommunity(${communityId})`),
    onClickUser: (userId) => console.log(`NavigationContext onClickUser(${userId})`),
    onCommunityCreated: (communityId) =>
      console.log(`NavigationContext onCommunityCreated(${communityId})`),
    onEditCommunity: (communityId) =>
      console.log(`NavigationContext onEditCommunity({${communityId})`),
    onEditUser: (userId) => console.log(`NavigationContext onEditUser(${userId})`),
    onMessageUser: (userId) => console.log(`NavigationContext onMessageUser(${userId})`),
    onBack: () => console.log('NavigationContext onBack()'),
  };
}

export const NavigationContext = createContext<ContextValue>(defaultValue);

export const useNavigation = () => useContext(NavigationContext);

interface NavigationProviderProps {
  askForConfirmation?: (params: {
    title: React.ReactNode;
    content: React.ReactNode;
    okText: React.ReactNode;
    onSuccess: () => void;
    onCancel: () => void;
  }) => void;
  children: React.ReactNode;
  onChangePage?: (data: { type: string; [x: string]: string | boolean }) => void;
  onClickCategory?: (categoryId: string) => void;
  onClickCommunity?: (communityId: string) => void;
  onClickUser?: (userId: string) => void;
  onCommunityCreated?: (communityId: string) => void;
  onEditCommunity?: (communityId: string, options?: { tab?: string }) => void;
  onEditUser?: (userId: string) => void;
  onMessageUser?: (userId: string) => void;
}

export default function NavigationProvider({
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
}: NavigationProviderProps) {
  const [pages, setPages] = useState<Page[]>([
    { type: PageTypes.NewsFeed, communityId: undefined },
  ]);
  const currentPage = useMemo(() => pages[pages.length - 1], [pages]);
  const [navigationBlocker, setNavigationBlocker] = useState<
    | {
        title: ReactNode;
        content: ReactNode;
        okText: ReactNode;
      }
    | null
    | undefined
  >();

  const confirmPageChange = useCallback(async () => {
    if (navigationBlocker) {
      // for more info about this, see https://ekoapp.atlassian.net/browse/UP-3462?focusedCommentId=77155
      return new Promise((resolve) => {
        askForConfirmation({
          ...navigationBlocker,
          onSuccess: () => {
            setNavigationBlocker?.(undefined);
            resolve(true);
          },
          onCancel: () => resolve(false),
        });
      });
    }

    return true;
  }, [askForConfirmation, navigationBlocker]);

  const pushPage = useCallback(
    async (newPage) => {
      if (!(await confirmPageChange())) return;

      setPages((prevState) => [...prevState, newPage]);
    },
    [confirmPageChange],
  );

  const popPage = () => {
    setPages((prevState) => (prevState.length > 1 ? prevState.slice(0, -1) : prevState));
  };

  const onChangePage = onChangePageProp
    ? async (data: { type: string; [x: string]: string | boolean }) => {
        if (!(await confirmPageChange())) return;

        onChangePageProp(data);
      }
    : null;

  const handleChangePage = useCallback(
    (type) => {
      // if (onChangePageProp) return onChangePage(type);
      console.log('handleChangePage', type);
      pushPage({ type });
    },
    [
      // onChangePageProp,
      pushPage,
    ],
  );

  const handleClickCommunity = useCallback(
    (communityId) => {
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
    (communityId) => {
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
    (categoryId) => {
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
    (userId) => {
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
    (userId) => {
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
        page: currentPage,
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
}
