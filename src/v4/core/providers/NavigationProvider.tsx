import React, { createContext, useCallback, useContext, useState, useMemo, ReactNode } from 'react';
import { AmityStoryMediaType } from '~/v4/social/pages/DraftsPage/DraftsPage';
import { Mode } from '~/v4/social/pages/PostComposerPage/PostComposerPage';
import { NavigationContext as NavigationContextV3 } from '~/social/providers/NavigationProvider';
import { AmityPostCategory } from '~/v4/social/components/PostContent/PostContent';

export enum PageTypes {
  Explore = 'explore',
  NewsFeed = 'newsfeed',
  CommunityFeed = 'communityFeed',
  CommunityEdit = 'communityEdit',
  Category = 'category',
  UserFeed = 'userFeed',
  UserEdit = 'userEdit',
  ViewStoryPage = 'ViewStoryPage',
  SocialHomePage = 'SocialHomePage',
  PostDetailPage = 'PostDetailPage',
  CommunityProfilePage = 'CommunityProfilePage',
  UserProfilePage = 'UserProfilePage',
  SocialGlobalSearchPage = 'SocialGlobalSearchPage',
  SelectPostTargetPage = 'SelectPostTargetPage',
  DraftPage = 'DraftPage',
  PostComposerPage = 'PostComposerPage',
  MyCommunitiesSearchPage = 'MyCommunitiesSearchPage',
  StoryTargetSelectionPage = 'StoryTargetSelectionPage',
  AllCategoriesPage = 'AllCategoriesPage',
  CommunitiesByCategoryPage = 'CommunitiesByCategoryPage',
  CommunityCreatePage = 'CommunityCreatePage',
}

type Page =
  | {
      type: PageTypes.Explore | PageTypes.NewsFeed;
      context: { communityId?: string };
    }
  | {
      type: PageTypes.CommunityFeed;
      context: {
        communityId: string;
        isNewCommunity: boolean;
      };
    }
  | {
      type: PageTypes.CommunityEdit;
      context: {
        communityId: string;
        tab: string;
      };
    }
  | {
      type: PageTypes.Category;
      context: {
        categoryId: string;
        communityId?: string;
      };
    }
  | {
      type: PageTypes.UserFeed | PageTypes.UserEdit;
      context: {
        userId: string;
        communityId?: string;
      };
    }
  | {
      type: PageTypes.ViewStoryPage;
      context: {
        targetId: string;
        targetType: Amity.StoryTargetType;
        storyType: 'communityFeed' | 'globalFeed';
      };
    }
  | {
      type: PageTypes.PostDetailPage;
      context: {
        postId: string;
        communityId?: string;
        hideTarget?: boolean;
        category?: AmityPostCategory;
      };
    }
  | { type: PageTypes.CommunityProfilePage; context: { communityId: string } }
  | { type: PageTypes.UserProfilePage; context: { userId: string; communityId?: string } }
  | { type: PageTypes.SocialHomePage; context: { communityId?: string } }
  | { type: PageTypes.SocialGlobalSearchPage; context: { tab?: string } }
  | { type: PageTypes.MyCommunitiesSearchPage; context: { communityId?: string } }
  | { type: PageTypes.SelectPostTargetPage }
  | {
      type: PageTypes.DraftPage;
      context: {
        communityId?: string;
        mediaType: AmityStoryMediaType;
        targetId: string;
        targetType: Amity.StoryTargetType;
        storyType: 'communityFeed' | 'globalFeed';
      };
    }
  | {
      type: PageTypes.PostComposerPage;
      context: {
        targetId: string | null;
        targetType: 'community' | 'user';
        mode: Mode;
        community?: Amity.Community;
        post?: Amity.Post;
      };
    }
  | {
      type: PageTypes.StoryTargetSelectionPage;
    }
  | {
      type: PageTypes.AllCategoriesPage;
    }
  | {
      type: PageTypes.CommunitiesByCategoryPage;
      context: {
        categoryId: string;
      };
    }
  | {
      type: PageTypes.CommunityCreatePage;
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
  goToUserProfilePage: (userId: string) => void;
  goToPostDetailPage: (postId: string, hideTarget?: boolean, category?: AmityPostCategory) => void;
  goToCommunityProfilePage: (communityId: string) => void;
  goToSocialGlobalSearchPage: (tab?: string) => void;
  goToMyCommunitiesSearchPage: () => void;
  goToSelectPostTargetPage: () => void;
  goToStoryTargetSelectionPage: () => void;
  goToCommunityCreatePage: () => void;
  goToDraftStoryPage: (
    targetId: string,
    targetType: string,
    mediaType: AmityStoryMediaType,
    storyType: 'communityFeed' | 'globalFeed',
  ) => void;
  goToViewStoryPage: (context: {
    targetId: string;
    targetType: Amity.StoryTargetType;
    storyType: 'communityFeed' | 'globalFeed';
  }) => void;
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
  goToPostComposerPage: (
    context:
      | {
          mode: Mode.CREATE;
          targetId: string | null;
          targetType: 'community' | 'user';
          community?: Amity.Community;
        }
      | { mode: Mode.EDIT; post: Amity.Post },
  ) => void;
  goToStoryCreationPage: (context: {
    targetId: string;
    targetType: Amity.StoryTargetType;
    mediaType: { type: 'image'; url: string } | { type: 'video'; url: string };
    storyType: 'communityFeed' | 'globalFeed';
  }) => void;
  goToSocialHomePage: () => void;
  goToAllCategoriesPage: () => void;
  goToCommunitiesByCategoryPage: (context: { categoryId: string }) => void;
  //V3 functions
  onClickStory: (
    storyId: string,
    storyType: 'communityFeed' | 'globalFeed',
    targetId?: string[],
  ) => void;
};

let defaultValue: ContextValue = {
  page: { type: PageTypes.SocialHomePage, context: { communityId: undefined } },
  onChangePage: (type: string) => {},
  onClickCategory: (categoryId: string) => {},
  onClickCommunity: (communityId: string) => {},
  onClickUser: (userId: string) => {},
  onCommunityCreated: (communityId: string) => {},
  onEditCommunity: (communityId: string) => {},
  onEditUser: (userId: string) => {},
  onMessageUser: (userId: string) => {},
  goToUserProfilePage: (userId: string) => {},
  goToPostDetailPage: (postId: string, hideTarget?: boolean, category?: AmityPostCategory) => {},
  goToViewStoryPage: (context: {
    targetId: string;
    targetType: Amity.StoryTargetType;
    storyType: 'communityFeed' | 'globalFeed';
  }) => {},
  goToDraftStoryPage: (
    targetId: string,
    targetType: string,
    mediaType: AmityStoryMediaType,
    storyType: 'communityFeed' | 'globalFeed',
  ) => {},
  goToCommunityProfilePage: (communityId: string) => {},
  goToSocialGlobalSearchPage: (tab?: string) => {},
  goToSelectPostTargetPage: () => {},
  goToStoryTargetSelectionPage: () => {},
  goToCommunityCreatePage: () => {},
  goToPostComposerPage: () => {},
  goToStoryCreationPage: () => {},
  goToSocialHomePage: () => {},
  goToMyCommunitiesSearchPage: () => {},
  goToAllCategoriesPage: () => {},
  goToCommunitiesByCategoryPage: (context: { categoryId: string }) => {},
  setNavigationBlocker: () => {},
  onBack: () => {},
  //V3 functions
  onClickStory: (
    storyId: string,
    storyType: 'communityFeed' | 'globalFeed',
    targetId?: string[],
  ) => {},
};

if (process.env.NODE_ENV !== 'production') {
  defaultValue = {
    page: { type: PageTypes.SocialHomePage, context: { communityId: undefined } },
    onChangePage: (type) => console.log(`NavigationContext onChangePage(${type})`),
    onClickCategory: (categoryId) =>
      console.log(`NavigationContext onClickCategory(${categoryId})`),
    onClickCommunity: (communityId) =>
      console.log(`NavigationContext onClickCommunity(${communityId})`),
    onClickUser: (userId) => console.log(`NavigationContext onClickUser(${userId})`),
    goToViewStoryPage: ({ targetId, storyType, targetType }) =>
      console.log(`NavigationContext goToViewStoryPage(${targetId}, ${storyType}, ${targetType})`),
    onCommunityCreated: (communityId) =>
      console.log(`NavigationContext onCommunityCreated(${communityId})`),
    onEditCommunity: (communityId) =>
      console.log(`NavigationContext onEditCommunity({${communityId})`),
    onEditUser: (userId) => console.log(`NavigationContext onEditUser(${userId})`),
    onMessageUser: (userId) => console.log(`NavigationContext onMessageUser(${userId})`),
    onBack: () => console.log('NavigationContext onBack()'),
    goToUserProfilePage: (userId) =>
      console.log(`NavigationContext goToUserProfilePage(${userId})`),
    goToPostDetailPage: (postId, hideTarget, category) =>
      console.log(`NavigationContext goToPostDetailPage(${postId} ${hideTarget} ${category})`),
    goToCommunityProfilePage: (communityId) =>
      console.log(`NavigationContext goToCommunityProfilePage(${communityId})`),
    goToSocialGlobalSearchPage: (tab) =>
      console.log(`NavigationContext goToSocialGlobalSearchPage(${tab})`),
    goToSelectPostTargetPage: () => console.log('NavigationContext goToTargetPage()'),
    goToCommunityCreatePage: () => console.log('NavigationContext goToCommunityCreatePage()'),
    goToStoryTargetSelectionPage: () =>
      console.log('NavigationContext goToStoryTargetSelectionPage()'),
    goToDraftStoryPage: (data) => console.log(`NavigationContext goToDraftStoryPage()`),
    goToPostComposerPage: () => console.log(`NavigationContext goToPostComposerPage()`),
    goToStoryCreationPage: () => console.log('NavigationContext goToStoryCreationPage()'),
    goToSocialHomePage: () => console.log('NavigationContext goToSocialHomePage()'),
    goToMyCommunitiesSearchPage: () =>
      console.log('NavigationContext goToMyCommunitiesSearchPage()'),
    goToAllCategoriesPage: () => console.log('NavigationContext goToAllCategoriesPage()'),
    goToCommunitiesByCategoryPage: (context) =>
      console.log(`NavigationContext goToCommunitiesByCategoryPage(${context})`),

    //V3 functions
    onClickStory: (storyId, storyType, targetIds) =>
      console.log(`NavigationContext onClickStory(${storyId}, ${storyType}, ${targetIds})`),
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
  onChangePage?: (
    data:
      | { type: string; [x: string]: string | boolean }
      | {
          type: string;
          context: {
            [x: string]: string | boolean;
          };
        },
  ) => void;
  onClickCategory?: (categoryId: string) => void;
  onClickCommunity?: (communityId: string) => void;
  onClickUser?: (userId: string) => void;
  goToViewStoryPage?: (context: {
    storyId: string;
    storyType: 'communityFeed' | 'globalFeed';
    targetType: Amity.StoryTargetType;
  }) => void;
  goToDraftStoryPage?: (
    targetId: string,
    targetType: string,
    mediaType: AmityStoryMediaType,
    storyType: 'communityFeed' | 'globalFeed',
  ) => void;
  goToAllCategoriesPage?: () => void;
  goToCommunitiesByCategoryPage?: (context: { categoryId: string }) => void;
  onCommunityCreated?: (communityId: string) => void;
  goToCommunityCreatePage?: () => void;
  onEditCommunity?: (communityId: string, options?: { tab?: string }) => void;
  onEditUser?: (userId: string) => void;
  onMessageUser?: (userId: string) => void;
  onBack?: () => void;
  //V3 functions
  onClickStory?: (
    storyId: string,
    storyType: 'communityFeed' | 'globalFeed',
    targetId?: string[],
  ) => void;
}

export default function NavigationProvider({
  askForConfirmation,
  children,
  onChangePage: onChangePageProp,
  onClickCategory,
  onClickCommunity,
  onClickUser,
  onCommunityCreated,
  onEditCommunity,
  onEditUser,
  onMessageUser,
  onBack,
}: NavigationProviderProps) {
  const [pages, setPages] = useState<Page[]>([
    { type: PageTypes.SocialHomePage, context: { communityId: undefined } },
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

  const confirmation = askForConfirmation ?? confirm;

  const pushPage = useCallback(async (newPage) => {
    setPages((prevState) => [...prevState, newPage]);
  }, []);

  const popPage = () => {
    setPages((prevState) => (prevState.length > 1 ? prevState.slice(0, -1) : prevState));
  };

  const onChangePage = onChangePageProp
    ? async (
        data:
          | { type: string; [x: string]: string | boolean }
          | {
              type: string;
              context: {
                [x: string]: string | boolean;
              };
            },
      ) => {
        onChangePageProp(data);
      }
    : null;

  const handleChangePage = useCallback(
    (type) => {
      pushPage({ type });
    },
    [pushPage],
  );

  const handleClickCommunity = useCallback(
    (communityId) => {
      const next = {
        type: PageTypes.CommunityProfilePage,
        context: {
          communityId,
        },
      };

      if (onChangePage) return onChangePage(next);
      if (onClickCommunity) return onClickCommunity(communityId);

      pushPage(next);
    },
    [onClickCommunity, pushPage],
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

      pushPage(next);
    },
    [onChangePage, onClickCategory, pushPage],
  );

  const handleClickUser = useCallback(
    (userId, pageType) => {
      const next = {
        type: pageType ?? PageTypes.UserFeed,
        context: {
          userId,
        },
      };

      if (onChangePage) return onChangePage(next);
      if (onClickUser) return onClickUser(userId);

      pushPage(next);
    },
    [onChangePage, onClickUser, pushPage],
  );

  const handleEditUser = useCallback(
    (userId) => {
      const next = {
        type: PageTypes.UserEdit,
        context: {
          userId,
        },
      };

      if (onChangePage) return onChangePage(next);
      if (onEditUser) return onEditUser(userId);

      pushPage(next);
    },
    [onChangePage, onEditUser, pushPage],
  );

  const handleEditCommunity = useCallback(
    (communityId, tab) => {
      const next = {
        type: PageTypes.CommunityEdit,
        context: {
          communityId,
          tab,
        },
      };

      if (onChangePage) return onChangePage(next);
      if (onEditCommunity) return onEditCommunity(communityId, { tab });

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
    },
    [onChangePage, onMessageUser],
  );

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    }
    popPage();
  }, [onChangePage, onBack, popPage]);

  const goToViewStoryPage = useCallback(
    ({ targetId, storyType, targetType }) => {
      const next = {
        type: PageTypes.ViewStoryPage,
        context: {
          targetId,
          storyType,
          targetType,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToUserProfilePage = useCallback(
    (userId) => {
      const next = {
        type: PageTypes.UserFeed,
        context: {
          userId,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToPostDetailPage = useCallback(
    (postId, hideTarget, category) => {
      const next = {
        type: PageTypes.PostDetailPage,
        context: {
          postId,
          hideTarget,
          category,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToCommunityProfilePage = useCallback(
    (communityId) => {
      const next = {
        type: PageTypes.CommunityProfilePage,
        context: {
          communityId,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToCommunityCreatePage = useCallback(() => {
    const next = {
      type: PageTypes.CommunityCreatePage,
      context: {},
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToSocialGlobalSearchPage = useCallback(
    (tab?: string) => {
      const next = {
        type: PageTypes.SocialGlobalSearchPage,
        context: { tab },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );
  const goToSelectPostTargetPage = useCallback(() => {
    const next = {
      type: PageTypes.SelectPostTargetPage,
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToStoryTargetSelectionPage = useCallback(() => {
    const next = {
      type: PageTypes.StoryTargetSelectionPage,
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToStoryCreationPage = useCallback(
    ({ targetId, targetType, mediaType, storyType }) => {
      const next = {
        type: PageTypes.DraftPage,
        context: {
          targetId,
          targetType,
          mediaType,
          storyType,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToDraftStoryPage = useCallback(
    (targetId, targetType, mediaType, storyType) => {
      const next = {
        type: PageTypes.DraftPage,
        context: {
          targetId,
          targetType,
          mediaType,
          storyType,
        },
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToSocialHomePage = useCallback(() => {
    const next = {
      type: PageTypes.SocialHomePage,
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToPostComposerPage = useCallback(
    (
      context:
        | {
            mode: Mode.CREATE;
            targetId: string | null;
            targetType: 'community' | 'user';
            community?: Amity.Community;
          }
        | { mode: Mode.EDIT; post: Amity.Post },
    ) => {
      const next = {
        type: PageTypes.PostComposerPage,
        context,
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const goToMyCommunitiesSearchPage = useCallback(() => {
    const next = {
      type: PageTypes.MyCommunitiesSearchPage,
      context: {},
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToAllCategoriesPage = useCallback(() => {
    const next = {
      type: PageTypes.AllCategoriesPage,
      context: {},
    };

    pushPage(next);
  }, [onChangePage, pushPage]);

  const goToCommunitiesByCategoryPage = useCallback(
    (context) => {
      const next = {
        type: PageTypes.CommunitiesByCategoryPage,
        context,
      };

      pushPage(next);
    },
    [onChangePage, pushPage],
  );

  const handleClickStory = useCallback(
    (targetId, storyType, targetIds) => {
      const next = {
        type: PageTypes.ViewStoryPage,
        context: {
          targetId,
          storyType,
          targetIds,
        },
      };

      if (onChangePage) return onChangePage(next);

      pushPage(next);
    },
    [onChangePage, pushPage],
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
        onBack: handleBack,
        goToUserProfilePage,
        goToPostDetailPage,
        goToSocialGlobalSearchPage,
        goToCommunityProfilePage,
        goToViewStoryPage,
        goToSelectPostTargetPage,
        goToStoryTargetSelectionPage,
        goToStoryCreationPage,
        goToDraftStoryPage,
        goToPostComposerPage,
        goToSocialHomePage,
        goToMyCommunitiesSearchPage,
        goToAllCategoriesPage,
        goToCommunitiesByCategoryPage,
        goToCommunityCreatePage,
        setNavigationBlocker,
        onClickStory: handleClickStory,
      }}
    >
      <NavigationContextV3.Provider
        value={{
          page: currentPage as any, //TODO : Fix any type
          onChangePage: handleChangePage,
          onClickCategory: handleClickCategory,
          onClickCommunity: handleClickCommunity,
          onClickUser: handleClickUser,
          onCommunityCreated: handleCommunityCreated,
          onEditCommunity: handleEditCommunity,
          onEditUser: handleEditUser,
          onMessageUser: handleMessageUser,
          onBack: handleBack,
          setNavigationBlocker,
          goToDraftStoryPage,
          onClickStory: handleClickStory,
        }}
      >
        {children}
      </NavigationContextV3.Provider>
    </NavigationContext.Provider>
  );
}
