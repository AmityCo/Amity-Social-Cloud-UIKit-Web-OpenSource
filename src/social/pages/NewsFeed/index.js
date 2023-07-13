import { PostTargetType } from '@amityco/js-sdk';

import Feed from '~/social/components/Feed';
import { PageTypes } from '~/social/constants';

import { useNavigation } from '~/social/providers/NavigationProvider';

import MyCommunitiesMobile from '~/social/components/MyCommunitiesMobile';
import { Wrapper } from './styles';
const NewsFeed = () => {
  const { onChangePage } = useNavigation();

  return (
    <Wrapper data-qa-anchor="news-feed">
      <MyCommunitiesMobile />
      <Feed
        targetType={PostTargetType.GlobalFeed}
        goToExplore={() => onChangePage(PageTypes.Explore)}
        showPostCreator
      />
    </Wrapper>
  );
};

export default NewsFeed;
