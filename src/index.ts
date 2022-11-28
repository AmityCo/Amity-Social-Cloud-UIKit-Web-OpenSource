export { default as AmityUiKitProvider } from '~/core/providers/UiKitProvider';
export { default as AmityUiKitFeed } from '~/social/components/Feed';
export { default as AmityUiKitSocial } from '~/social/pages/Application';
export { default as AmityUiKitChat } from '~/chat/pages/Application';
export { ActionEvents } from '~/core/providers/ActionProvider';

// Export helper
export {
  createNewChat as amityCreateNewChat,
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

export { default as AmityLayout } from '~/social/layouts/Main';
export { default as AmityCommunitySideMenu } from '~/social/components/CommunitySideMenu';
export { default as useAmityMyCommunitiesList } from '~/social/hooks/useMyCommunitiesList';

export { default as AmityExplorePage } from '~/social/pages/Explore';
export { default as AmityNewsFeedPage } from '~/social/pages/NewsFeed';
export { default as AmityCommunityFeedPage } from '~/social/pages/CommunityFeed';
export { default as AmityUserFeedPage } from '~/social/pages/UserFeed';
export { default as AmityCategoryCommunitiesPage } from '~/social/pages/CategoryCommunities';
export { default as AmityCommunityEditPage } from '~/social/pages/CommunityEdit';
export { default as AmityProfileSettings } from '~/social/components/ProfileSettings';
export { default as AmityCommunityPostPage } from '~/social/pages/CommunityPost';
export { default as AmityUserPostPage } from '~/social/pages/UserPost';
export { default as AmityUserHeader } from '~/social/components/UserHeader';

export {
  OnboardingModal,
  OnboardingModalProps,
  OnboardingStep,
} from '~/social/components/onboarding';

export { PageTypes } from '~/social/constants';

export {
  NotificationRecordList,
  NotificationRecordPopover,
  NotificationRecordListHeader,
  NotificationRecordPopoverProps,
  NotificationRecordListProps,
} from '~/core/components/NotificationTray';

export { NotificationSettings, NotificationSettingsProps } from '~/core/components/Settings';

export {
  ApiEndpoint,
  ApiRegion,
  CommunityRepository,
  FileRepository,
  UserRepository,
} from '@amityco/js-sdk';

// import AmityComment from './components/Comment';
// import AmityCommentComposeBar from './components/CommentComposeBar';
// import AmityCommentLikeButton from './components/CommentLikeButton';
// import AmityCommunity from './components/Community';
// import AmityCommunityItem from './components/CommunityItem';
// import AmityEmptyFeed from './components/EmptyFeed';
// import AmityFiles from './components/Files';
// import AmityImageGallery from './components/ImageGallery';
// import AmityImages from './components/Images';
// import AmityMessage from './components/Message';
// import AmityMessageComposeBar from './components/MessageComposeBar';
// import AmityMessageList from './components/MessageList';
// import AmityPost from './components/Post';
// import AmityPostCreator from './components/PostCreator';
// import AmityPostLikeButton from './components/PostLikeButton';
// import AmityRecentChat from './components/RecentChat';
// import AmitySideMenu from './components/SideMenu';
