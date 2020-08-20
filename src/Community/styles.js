import styled from 'styled-components';
import UiPost from '../Post';
import UiPostCompose from '../PostCompose';
import UiCommunityHeader from '../CommunityHeader';
import UiUserFeedHeader from '../UserFeedHeader';

export const Post = styled(UiPost)`
  margin-bottom: 12px;
`;

export const CommunityHeader = styled(UiCommunityHeader)`
  margin-bottom: 12px;
`;

export const UserFeedHeader = styled(UiUserFeedHeader)`
  margin-bottom: 12px;
`;

export const PostCompose = styled(UiPostCompose)`
  margin-bottom: 14px;
`;

export const Content = styled.div`
  overflow-y: auto;
  display: flex;
`;

export const Feed = styled.div`
  margin-right: 36px;
`;
