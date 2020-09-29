import styled from 'styled-components';
import Tabs from '~/core/components/Tabs';
import UIUserFeedHeader from '~/social/components/UserFeedHeader';
import UIPost from '~/social/components/Post';
import UIPostCompose from '~/social/components/PostCompose';
import UIFeedHeaderTabs from '~/social/components/FeedHeaderTabs';
import UiKitAvatar from '~/core/components/Avatar';

export const CommunityMembersTabs = styled(Tabs)`
  margin-bottom: 14px;
`;

export const Avatar = styled(UiKitAvatar)`
  margin-right: 8px;
`;

export const Post = styled(UIPost)`
  margin-bottom: 12px;
`;

export const FeedHeaderTabs = styled(UIFeedHeaderTabs)`
  margin-bottom: 12px;
`;

export const UserFeedHeader = styled(UIUserFeedHeader)`
  margin-bottom: 12px;
`;

export const PostCompose = styled(UIPostCompose)`
  margin-bottom: 14px;
`;

export const Content = styled.div`
  width: 100%;
  padding: 24px 78px 0;
  overflow-y: auto;
  display: flex;
`;

export const Feed = styled.div`
  margin-right: 36px;
  width: 560px;
  flex-shrink: 0;
`;

export const CommunityMembersContainer = styled.div`
  background: #ffffff;
  border: 1px solid #edeef2;
  border-radius: 4px;
  flex: 2;
`;

export const CommunityMembersHeader = styled.div`
  ${({ theme }) => theme.typography.title}
  padding: 16px;
`;

export const CommunityMemberContainer = styled.div`
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
`;

export const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const MemberName = styled.div`
  ${({ theme }) => theme.typography.bodyBold}
`;

export const Caption = styled.div`
  ${({ theme }) => theme.typography.caption}
  color: ${({ theme }) => theme.palette.base.shade1};
`;
