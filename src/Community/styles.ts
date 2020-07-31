import styled from 'styled-components';
import UiPost from '../Post';
import UiPostCompose from '../PostCompose';
import UiCommunityHeader from '../CommunityHeader';

export const Post = styled(UiPost)`
  margin-bottom: 12px;
`;

export const CommunityHeader = styled(UiCommunityHeader)`
  margin: 24px 0 12px;
`;

export const PostCompose = styled(UiPostCompose)`
  margin-bottom: 14px;
`;

export const CommunityContainer = styled.div`
  display: flex;
  background: #f7f7f8;
  height: 90vh;
  overflow: hidden;
`;

export const CommunityContent = styled.div`
  overflow-y: auto;
  display: flex;
`;

export const CommunityFeed = styled.div`
  margin-right: 36px;
`;

export const CommunityWrapper = styled.div`
  width: 100%;
  padding: 0 78px;
  overflow: scroll;
`;
