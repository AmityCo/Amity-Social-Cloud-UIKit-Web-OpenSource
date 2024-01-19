import React, { ReactNode, createContext, useContext } from 'react';

type CustomComponentName =
  | 'Avatar'
  | 'CategoryHeader'
  | 'CategorySelector'
  | 'Chat'
  | 'ChatDetails'
  | 'ChatHeader'
  | 'ChatItem'
  | 'Comment'
  | 'CommentComposerBar'
  | 'CommentLikeButton'
  | 'CommunityCreatedModel'
  | 'CommunityCreationModal'
  | 'CommunityForm'
  | 'CommunityItem'
  | 'CommunityMembers'
  | 'CommunityName'
  | 'CommunityPermissions'
  | 'EmptyFeed'
  | 'EngagementBar'
  | 'Feed'
  | 'FeedHeaderTabs'
  | 'File'
  | 'Image'
  | 'ImageGallery'
  // | 'ImageGallery'
  | 'Images'
  | 'Layout'
  // | 'Layout'
  | 'MediaGallery'
  | 'MenuTab'
  | 'Message'
  | 'MessageComposerBar'
  | 'MessageList'
  | 'Post'
  | 'PostLikeButton'
  | 'PostTargetSelector'
  | 'ProfileSettings'
  | 'ProfileSettingsTabs'
  | 'RecentChat'
  | 'SideNavBar'
  | 'SocialSearch'
  | 'Tabs'
  | 'UICategoryCard'
  | 'UICommunityCard'
  | 'UICommunityHeader'
  | 'UICommunityInfo'
  | 'UIEngagementBar'
  | 'UIPostHeader'
  | 'UITextContent'
  | 'UITrendingItem'
  | 'UIUserInfo'
  | 'UserChip'
  | 'UserHeader'
  // | 'UserSelector'
  | 'UserSelector';

export type CustomComponentType = Partial<
  Record<CustomComponentName, <TProps>(props: TProps) => React.ReactElement<TProps>>
>;

const CustomComponentContext = createContext<CustomComponentType>({});

export const useCustomComponent = <TProps,>(
  componentName: CustomComponentName,
): ((props: TProps) => React.ReactElement<TProps>) | null => {
  const contextValue = useContext(CustomComponentContext);

  return contextValue[componentName] || null;
};

export default function CustomComponentsProvider({
  children,
  config,
}: {
  children: ReactNode;
  config: CustomComponentType;
}) {
  return (
    <CustomComponentContext.Provider value={config}>{children}</CustomComponentContext.Provider>
  );
}
