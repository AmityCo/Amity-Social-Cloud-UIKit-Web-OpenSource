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
export { default as AmityUIKitManager } from '~/v4/core/AmityUIKitManager';
export { AmityDraftStoryPage, ViewStoryPage as AmityViewStoryPage } from '~/v4/social/pages';
export {
  CommentTray as AmityCommentTrayComponent,
  StoryTab as AmityStoryTabComponent,
} from '~/v4/social/components';

// Chat v4
export {
  AmityLiveChatHeader,
  AmityLiveChatMessageList,
  AmityLiveChatMessageReceiverView,
  AmityLiveChatMessageSenderView,
  AmityLiveChatMessageComposeBar,
} from '~/v4/chat/components';

export { MessageReactionPreview as AmityLiveChatMessageReactionPreview } from '~/v4/chat/components/MessageReactionPreview';
export { MessageReactionPicker as AmityLiveChatMessageReactionPicker } from '~/v4/chat/components/MessageReactionPicker';
export { MessageQuickReaction as AmityLiveChatMessageQuickReaction } from '~/v4/chat/components/MessageQuickReaction';
export { ReactionList as AmityReactionList } from '~/v4/social/components/ReactionList';

import type { AmityMessageActionType } from '~/v4/chat/components';
import type { ReactionListProps } from '~/v4/social/components/ReactionList';

export type { AmityMessageActionType };
export type { ReactionListProps as AmityReactionListProps };

export { AmityLiveChatPage } from '~/v4/chat/pages';

// v4 internal use only (Amity Console)
export {
  StoryPreview as AmityStoryPreview,
  StoryPreviewThumbnail as AmityStoryPreviewThumbnail,
} from './v4/social/internal-components/StoryPreview';
