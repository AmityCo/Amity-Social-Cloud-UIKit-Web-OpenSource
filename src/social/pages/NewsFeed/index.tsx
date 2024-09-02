import React from 'react';

import { PageTypes } from '~/social/constants';
import Feed from '~/social/components/Feed';

import { useNavigation } from '~/social/providers/NavigationProvider';

import {
  CommunitySideMenuOverlay,
  HeadTitle,
  MobileContainer,
  StyledBarsIcon,
  StyledCommunitySideMenu,
  Wrapper,
} from './styles';
import { useIntl } from 'react-intl';
import { StoryTab } from '~/social/components/StoryTab';

interface NewsFeedProps {
  isOpen: boolean;
  toggleOpen: () => void;
}

const NewsFeed = ({ isOpen, toggleOpen }: NewsFeedProps) => {
  const { onChangePage } = useNavigation();
  const { formatMessage } = useIntl();

  return (
    <Wrapper data-qa-anchor="news-feed">
      <CommunitySideMenuOverlay isOpen={isOpen} onClick={toggleOpen} />
      <StyledCommunitySideMenu isOpen={isOpen} />
      <MobileContainer>
        <StyledBarsIcon onClick={toggleOpen} />
        <HeadTitle>{formatMessage({ id: 'sidebar.community' })}</HeadTitle>
      </MobileContainer>
      <StoryTab type="globalFeed" />
      <Feed
        targetType={'globalFeed'}
        goToExplore={() => onChangePage(PageTypes.Explore)}
        showPostCreator
      />
    </Wrapper>
  );
};

export default NewsFeed;
