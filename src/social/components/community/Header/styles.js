import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import customizableComponent from '~/core/hocs/customization';

import Avatar from '~/core/components/Avatar';
import CommunityName from '~/social/components/community/Name';
import { backgroundImage as CommunityImage } from '~/icons/Community';

const CommunityHeaderContainer = styled.a.attrs(props => props)`
  display: grid;
  grid-template-areas: 'avatar title' 'avatar children';
  grid-template-columns: min-content auto;
  grid-template-rows: min-content min-content;
  grid-gap: 0 0.75em;
  padding: 0.5em;
  border-radius: 4px;
  align-items: center;
  color: ${({ theme }) => theme.palette.base.main};
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.palette.base.shade4};
  }
  ${({ isActive, theme }) =>
    isActive &&
    css`
      color: ${theme.palette.primary.main};
      background-color: ${theme.palette.primary.shade3};
    `};

  ${({ hasChildren }) =>
    !hasChildren &&
    css`
      grid-template-areas: 'avatar title';
      align-items: center;
    `}
`;

const CommunityHeaderAvatar = styled(Avatar)`
  grid-area: avatar;
`;

const Rest = styled.div`
  grid-area: children;
`;

const UICommunityHeader = ({
  communityId,
  isActive,
  avatarFileUrl,
  onClick,
  isSearchResult,
  searchInput,
  children,
}) => (
  <CommunityHeaderContainer
    isActive={isActive}
    onClick={() => onClick(communityId)}
    hasChildren={!!children}
  >
    <CommunityHeaderAvatar avatar={avatarFileUrl} backgroundImage={CommunityImage} />
    <CommunityName
      communityId={communityId}
      isActive={isActive}
      isSearchResult={isSearchResult}
      searchInput={searchInput}
    />
    {children && <Rest>{children}</Rest>}
  </CommunityHeaderContainer>
);

UICommunityHeader.propTypes = {
  communityId: PropTypes.string,
  isActive: PropTypes.bool,
  avatarFileUrl: PropTypes.string,
  onClick: PropTypes.func,
  isSearchResult: PropTypes.bool,
  searchInput: PropTypes.string,
  children: PropTypes.node,
};

export default customizableComponent('UICommunityHeader', UICommunityHeader);
