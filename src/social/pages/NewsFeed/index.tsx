import React from 'react';

import { PageTypes } from '~/social/constants';
import Feed from '~/social/components/Feed';

import { useNavigation } from '~/social/providers/NavigationProvider';

import {
  CommunitySideMenuOverlay,
  HeadTitle,
  MobileContainer,
  StyledCommunitySideMenu,
  Wrapper,
} from './styles';

import { BarsIcon } from '~/V4/icons';
import { useIntl } from 'react-intl';

type NewsFeedProps = {
  isOpen: boolean;
  toggleOpen: () => void;
};

const NewsFeed = ({ isOpen, toggleOpen }: NewsFeedProps) => {
  const { formatMessage } = useIntl();
  const { onChangePage } = useNavigation();

  return (
    <Wrapper data-qa-anchor="news-feed">
      <CommunitySideMenuOverlay isOpen={isOpen} onClick={toggleOpen} />
      <StyledCommunitySideMenu isOpen={isOpen} onClose={toggleOpen} />
      <MobileContainer>
        <BarsIcon onClick={toggleOpen} />
        <HeadTitle>{formatMessage({ id: 'sidebar.community' })}</HeadTitle>
      </MobileContainer>
      <Feed
        targetType={'globalFeed'}
        goToExplore={() => onChangePage(PageTypes.Explore)}
        showPostCreator
      />
    </Wrapper>
  );
};

export default NewsFeed;
