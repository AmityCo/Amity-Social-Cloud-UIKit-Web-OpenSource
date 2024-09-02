export { default as AmityUiKitProvider } from '~/v4/core/providers/AmityUIKitProvider';
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

// v4
export { AmityUIKitManager } from '~/v4/core/AmityUIKitManager';

// Chat v4

export { ChatHeader as AmityLiveChatHeader } from '~/v4/chat/components/ChatHeader';
export { MessageList as AmityLiveChatMessageList } from '~/v4/chat/components/MessageList';
export { MessageComposer as AmityLiveChatMessageComposeBar } from '~/v4/chat/components/MessageComposer';

export { MessageReactionPreview as AmityLiveChatMessageReactionPreview } from '~/v4/chat/components/MessageReactionPreview';
export { MessageReactionPicker as AmityLiveChatMessageReactionPicker } from '~/v4/chat/components/MessageReactionPicker';
export { MessageQuickReaction as AmityLiveChatMessageQuickReaction } from '~/v4/chat/components/MessageQuickReaction';

import type { MessageActionType } from '~/v4/chat/internal-components/LiveChatMessageContent/MessageAction';
import type { ReactionListProps } from '~/v4/social/components/ReactionList';

export type { MessageActionType as AmityMessageActionType };
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
  CommunityProfilePage as AmityCommunityProfilePage,
} from '~/v4/social/pages';

export {
  MyCommunities as AmityMyCommunitiesComponent,
  EmptyNewsfeed as AmityEmptyNewsFeedComponent,
  GlobalFeed as AmityGlobalFeedComponent,
  PostContent as AmityPostContentComponent,
  TopSearchBar as AmityTopSearchBarComponent,
  Newsfeed as AmityNewsFeedComponent,
  CommunitySearchResult as AmityCommunitySearchResultComponent,
  UserSearchResult as AmityUserSearchResultComponent,
  DetailedMediaAttachment as AmityDetailedMediaAttachmentComponent,
  MediaAttachment as AmityMediaAttachmentComponent,
  CreatePostMenu as AmityCreatePostMenuComponent,
  ReactionList as AmityReactionListComponent,
  TopNavigation as AmitySocialHomeTopNavigationComponent,
  CommentTray as AmityCommentTrayComponent,
  StoryTab as AmityStoryTabComponent,
  CommunityHeader as AmityCommunityHeaderComponent,
  CommunityFeed as AmityCommunityFeedComponent,
  CommunityPinnedPost as AmityCommunityPinnedPostComponent,
} from '~/v4/social/components/';

export { HomePageTab as AmitySocialHomePageTab } from '~/v4/social/pages/SocialHomePage';
