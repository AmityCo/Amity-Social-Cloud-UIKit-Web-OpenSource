import React from 'react';
import { PostTargetType } from '@amityco/js-sdk';

import { eagerImportDefault } from '~/helpers/eagerImport';

import { PageTypes } from '~/social/constants';

import { useNavigation } from '~/social/providers/NavigationProvider';

import { Wrapper } from './styles';

const Feed = eagerImportDefault(() => import('../../components/Feed'));

const NewsFeed = () => {
  const { onChangePage } = useNavigation();

  return (
    <Wrapper data-qa-anchor="news-feed">
      <React.Suspense fallback={null}>
        <Feed
          targetType={PostTargetType.GlobalFeed}
          goToExplore={() => onChangePage(PageTypes.Explore)}
          showPostCreator
        />
      </React.Suspense>
    </Wrapper>
  );
};

export default NewsFeed;
