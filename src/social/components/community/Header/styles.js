import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Skeleton from '~/core/components/Skeleton';

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

  ${({ $loading }) =>
    !$loading &&
    `&:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.palette.base.shade4};
  }`}

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
  isOfficial,
  isPublic,
  isSearchResult,
  name,
  searchInput,
  children,
  loading,
}) => (
  <CommunityHeaderContainer
    isActive={isActive}
    onClick={() => onClick(communityId)}
    hasChildren={!!children}
    $loading={loading}
  >
    <CommunityHeaderAvatar
      avatar={avatarFileUrl}
      backgroundImage={CommunityImage}
      loading={loading}
    />
    {loading && children ? (
      <Skeleton style={{ fontSize: 8, maxWidth: 120 }} />
    ) : (
      <CommunityName
        isActive={isActive}
        isOfficial={isOfficial}
        isPublic={isPublic}
        isSearchResult={isSearchResult}
        name={name}
        searchInput={searchInput}
        loading={loading}
      />
    )}
    {children && <Rest>{children}</Rest>}
  </CommunityHeaderContainer>
);

UICommunityHeader.propTypes = {
  communityId: PropTypes.string,
  isActive: PropTypes.bool,
  avatarFileUrl: PropTypes.string,
  onClick: PropTypes.func,
  isOfficial: PropTypes.bool,
  isPublic: PropTypes.bool,
  isSearchResult: PropTypes.bool,
  name: PropTypes.string,
  searchInput: PropTypes.string,
  children: PropTypes.node,
  loading: PropTypes.bool,
};

UICommunityHeader.defaultProps = {
  onClick: () => {},
};

export default customizableComponent('UICommunityHeader', UICommunityHeader);
