import styled from 'styled-components';
import UIPost from '../Post';
import UIPostCompose from '../PostCompose';
import UIFeedHeaderTabs from '../commonComponents/FeedHeaderTabs';
import UIUserFeedHeader from '../UserFeedHeader';

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
  overflow-y: auto;
  display: flex;
`;

export const Feed = styled.div`
  margin-right: 36px;
`;
