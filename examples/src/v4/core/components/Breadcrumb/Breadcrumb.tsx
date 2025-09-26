import React from 'react';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { PageTypes } from '~/v4/core/providers/NavigationProvider';
import { HomePageTab } from '~/v4/social/constants/HomePageTab';
import { Typography } from '~/v4/core/components';
import styles from './Breadcrumb.module.css';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface BreadcrumbProps {
  pageId?: string;
  componentId?: string;
  maxItems?: number;
  showHomeIcon?: boolean;
}

const getPageLabel = (pageType: string, context: any, activeTab?: HomePageTab): string => {
  switch (pageType) {
    case PageTypes.SocialHomePage:
      switch (activeTab) {
        case HomePageTab.Newsfeed:
          return 'Newsfeed';
        case HomePageTab.Explore:
          return 'Explore';
        case HomePageTab.MyCommunities:
          return 'My Communities';
        default:
          return 'Home';
      }
    case PageTypes.CommunityProfilePage:
      return 'Community';
    case PageTypes.UserProfilePage:
      return 'User Profile';
    case PageTypes.PostDetailPage:
      return 'Post Details';
    case PageTypes.SocialGlobalSearchPage:
      return 'Search';
    case PageTypes.MyCommunitiesSearchPage:
      return 'Search Communities';
    case PageTypes.NotificationTrayPage:
      return 'Notifications';
    case PageTypes.CommunitySetupPage:
      return 'Community Setup';
    case PageTypes.PostComposerPage:
      return context?.mode === 'edit' ? 'Edit Post' : 'Create Post';
    case PageTypes.EditUserProfilePage:
      return 'Edit Profile';
    case PageTypes.ChangeAvatarPage:
      return 'Change Avatar';
    case PageTypes.UserRelationshipPage:
      return 'Relationships';
    case PageTypes.BlockedUsersPage:
      return 'Blocked Users';
    case PageTypes.CommunityMembershipPage:
      return 'Members';
    case PageTypes.CommunitySettingPage:
      return 'Community Settings';
    case PageTypes.PendingPostsPage:
      return 'Pending Posts';
    case PageTypes.AllCategoriesPage:
      return 'Categories';
    case PageTypes.CommunitiesByCategoryPage:
      return 'Communities';
    case PageTypes.ViewStoryPage:
      return 'Story';
    case PageTypes.DraftPage:
      return 'Draft';
    case PageTypes.SelectPostTargetPage:
      return 'Select Target';
    case PageTypes.StoryTargetSelectionPage:
      return 'Select Story Target';
    case PageTypes.PollTargetSelectionPage:
      return 'Select Poll Target';
    case PageTypes.DraftClipPage:
      return 'Draft Clip';
    case PageTypes.ClipFeedPage:
      return 'Clips';
    default:
      return 'Page';
  }
};

export function Breadcrumb({
  pageId = '*',
  componentId = '*',
  maxItems = 3,
  showHomeIcon = false,
}: BreadcrumbProps) {
  const { page } = useNavigation();
  const { activeTab } = useLayoutContext();
  const {
    goToCommunityProfilePage,
    goToUserProfilePage,
    goToPostDetailPage,
    goToSocialHomePage,
    goToSocialGlobalSearchPage,
    goToMyCommunitiesSearchPage,
    goToNotificationTrayPage,
    goToAllCategoriesPage,
    goToCommunitiesByCategoryPage,
    onBack,
  } = useNavigation();

  // Build breadcrumb based on current location hierarchy
  const buildLocationBreadcrumb = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [];

    if (!page) return items;

    // Determine the main section based on current page
    const getMainSection = () => {
      switch (page.type) {
        case PageTypes.UserProfilePage:
        case PageTypes.EditUserProfilePage:
          return {
            label: 'Profile',
            onClick: () => goToUserProfilePage((page as any).context?.userId),
          };

        case PageTypes.NotificationTrayPage:
          return { label: 'Notifications', onClick: () => goToNotificationTrayPage() };

        case PageTypes.SocialHomePage:
          return { label: 'Home', onClick: () => goToSocialHomePage() };

        case PageTypes.CommunityProfilePage:
        case PageTypes.CommunityMembershipPage:
        case PageTypes.CommunitySettingPage:
        case PageTypes.PendingPostsPage:
          return {
            label: 'Community',
            onClick: () => {
              if ((page as any).context?.communityId) {
                goToCommunityProfilePage((page as any).context.communityId);
              }
            },
          };

        case PageTypes.PostDetailPage:
        case PageTypes.PostComposerPage:
          // For posts, determine if it's in a community or general feed
          if ((page as any).context?.communityId) {
            return {
              label: 'Community',
              onClick: () => goToCommunityProfilePage((page as any).context.communityId),
            };
          }
          return { label: 'Home', onClick: () => goToSocialHomePage() };

        case PageTypes.SocialGlobalSearchPage:
        case PageTypes.MyCommunitiesSearchPage:
        case PageTypes.AllCategoriesPage:
        case PageTypes.CommunitiesByCategoryPage:
          return { label: 'Home', onClick: () => goToSocialHomePage() };

        default:
          return { label: 'Home', onClick: () => goToSocialHomePage() };
      }
    };

    const mainSection = getMainSection();

    // Add main section if it's not the current page
    const currentPageLabel = getPageLabel(page.type, (page as any).context, activeTab);
    if (mainSection.label !== currentPageLabel) {
      items.push({
        label: mainSection.label,
        onClick: mainSection.onClick,
        isActive: false,
      });
    }

    // Add current page
    items.push({
      label: currentPageLabel,
      onClick: undefined,
      isActive: true,
    });

    return items;
  };

  const breadcrumbItems = buildLocationBreadcrumb();

  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb navigation">
      <Typography.Caption className={styles.breadcrumb__text}>
        {breadcrumbItems.map((item: BreadcrumbItem, index: number) => (
          <span key={index}>
            {item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                className={styles.breadcrumb__link}
                aria-current={item.isActive ? 'page' : undefined}
              >
                {item.label}
              </button>
            ) : (
              <span
                className={item.isActive ? styles.breadcrumb__textActive : ''}
                aria-current={item.isActive ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
            {index < breadcrumbItems.length - 1 && (
              <span className={styles.breadcrumb__separator}> / </span>
            )}
          </span>
        ))}
      </Typography.Caption>
    </nav>
  );
}
