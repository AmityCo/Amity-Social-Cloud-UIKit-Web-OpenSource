import React, { useContext } from 'react';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';

export interface PageBehavior {
  AmityDraftStoryPageBehavior: {
    onCloseAction(): void;
  };
  onClickHyperLink(): void;
  AmitySocialHomePageBehavior: Record<string, unknown>;
  AmityGlobalFeedComponentBehavior: {
    goToPostDetailPage: (context: { postId: string }) => void;
  };
  AmityPostDetailPageBehavior: Record<string, unknown>;
  AmityPostContentComponentBehavior: {
    goToCommunityProfilePage: (context: { communityId: string }) => void;
    goToUserProfilePage: (context: { userId: string }) => void;
  };
  AmitySocialGlobalSearchPageBehavior: Record<string, unknown>;
  AmityCommunitySearchResultComponentBehavior: {
    goToCommunityProfilePage: (context: { communityId: string }) => void;
  };
}

const PageBehaviorContext = React.createContext<PageBehavior | undefined>(undefined);

interface PageBehaviorProviderProps {
  children: React.ReactNode;
  pageBehavior?: Partial<PageBehavior>;
}

export const PageBehaviorProvider: React.FC<PageBehaviorProviderProps> = ({
  children,
  pageBehavior = {},
}) => {
  const { onBack, goToPostDetailPage, goToCommunityProfilePage, goToUserProfilePage } =
    useNavigation();
  const navigationBehavior: PageBehavior = {
    AmityDraftStoryPageBehavior: {
      onCloseAction: () => {
        if (pageBehavior?.AmityDraftStoryPageBehavior?.onCloseAction) {
          return pageBehavior.AmityDraftStoryPageBehavior.onCloseAction();
        }
        onBack();
      },
    },
    onClickHyperLink: () => {},
    AmitySocialHomePageBehavior: {},
    AmityGlobalFeedComponentBehavior: {
      goToPostDetailPage: (context: { postId: string }) => {
        if (pageBehavior?.AmityGlobalFeedComponentBehavior?.goToPostDetailPage) {
          return pageBehavior?.AmityGlobalFeedComponentBehavior.goToPostDetailPage(context);
        }
        goToPostDetailPage(context.postId);
      },
    },
    AmityPostDetailPageBehavior: {},
    AmityPostContentComponentBehavior: {
      goToCommunityProfilePage: (context: { communityId: string }) => {
        if (pageBehavior?.AmityPostContentComponentBehavior?.goToCommunityProfilePage) {
          return pageBehavior.AmityPostContentComponentBehavior.goToCommunityProfilePage(context);
        }
        goToCommunityProfilePage(context.communityId);
      },
      goToUserProfilePage: (context: { userId: string }) => {
        if (pageBehavior?.AmityPostContentComponentBehavior?.goToUserProfilePage) {
          return pageBehavior.AmityPostContentComponentBehavior.goToUserProfilePage(context);
        }
        goToUserProfilePage(context.userId);
      },
    },
    AmitySocialGlobalSearchPageBehavior: {},
    AmityCommunitySearchResultComponentBehavior: {
      goToCommunityProfilePage: (context: { communityId: string }) => {
        if (pageBehavior?.AmityCommunitySearchResultComponentBehavior?.goToCommunityProfilePage) {
          return pageBehavior.AmityCommunitySearchResultComponentBehavior.goToCommunityProfilePage(
            context,
          );
        }
        goToCommunityProfilePage(context.communityId);
      },
    },
  };

  return (
    <PageBehaviorContext.Provider value={navigationBehavior}>
      {children}
    </PageBehaviorContext.Provider>
  );
};

export const usePageBehavior = () => {
  const pageBehavior = useContext(PageBehaviorContext);
  if (!pageBehavior) {
    throw new Error('usePageBehavior must be used within a PageBehaviorProvider');
  }
  return pageBehavior;
};
