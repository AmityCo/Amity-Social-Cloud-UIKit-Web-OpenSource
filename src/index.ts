export { default as AmityUiKitProvider } from '~/core/providers/UiKitProvider';
export { default as AmityUiKitFeed } from '~/social/components/Feed';
export { default as AmityUiKitSocial } from '~/social/pages/Application';
export { default as AmityUiKitChat } from '~/chat/pages/Application';

// Export helper
export {
  addChatMembers as amityAddChatMembers,
  removeChatMembers as amityRemoveChatMembers,
} from '~/chat/helpers';

export { default as useAmityUser } from '~/core/hooks/useUser';
export { useNavigation as useAmityNavigation } from '~/social/providers/NavigationProvider';

export { default as AmityAvatar } from '~/core/components/Avatar';
export { PostContainer as AmityPostContainer } from '~/social/components/post/Post/styles';
export { default as AmityPostEngagementBar } from '~/social/components/EngagementBar';
export { default as AmityExpandableText } from '~/social/components/Comment/CommentText';
export { useSDK as useAmitySDK } from '~/core/hooks/useSDK';

export { AmityUIKitManager } from '~/v4/core/AmityUIKitManager';
export {
  CommentTray as AmityCommentTrayComponent,
  StoryTab as AmityStoryTabComponent,
} from '~/v4/social/components';

export { ReactionList as AmityReactionList } from '~/v4/social/components/ReactionList';

import type { ReactionListProps } from '~/v4/social/components/ReactionList';
export type { ReactionListProps as AmityReactionListProps };

export { LiveChat as AmityLiveChatPage } from '~/v4/chat/pages/LiveChat';

// v4 internal use only (Amity Console)
export {
  StoryPreview as AmityStoryPreview,
  StoryPreviewThumbnail as AmityStoryPreviewThumbnail,
} from './v4/social/internal-components/StoryPreview';

// v4 Social
export {
  SocialHomePage as AmitySocialHomePage,
  AmityDraftStoryPage,
  ViewStoryPage as AmityViewStoryPage,
  StoryTargetSelectionPage as AmityStoryTargetSelectionPage,
  PostDetailPage as AmityPostDetailPage,
  SocialGlobalSearchPage as AmitySocialGlobalSearchPage,
  MyCommunitiesSearchPage as AmityMyCommunitiesSearchPage,
  SelectPostTargetPage as AmityPostTargetSelectionPage,
  PostComposerPage as AmityPostComposerPage,
} from '~/v4/social/pages';

export { HomePageTab as AmitySocialHomePageTab } from '~/v4/social/pages/SocialHomePage';
