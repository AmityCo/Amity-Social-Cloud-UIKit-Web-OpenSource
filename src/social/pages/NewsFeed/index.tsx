import React from 'react';

import { PageTypes } from '~/social/constants';
import Feed from '~/social/components/Feed';

import { useNavigation } from '~/social/providers/NavigationProvider';

import { Wrapper } from './styles';

const NewsFeed = () => {
  const { onChangePage } = useNavigation();

  return (
    <Wrapper data-qa-anchor="news-feed">
      <Feed
        targetType={'globalFeed'}
        goToExplore={() => onChangePage(PageTypes.Explore)}
        showPostCreator
      />
    </Wrapper>
  );
};

export default NewsFeed;
