import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import customizableComponent from '~/core/hocs/customization';

import Avatar from '~/core/components/Avatar';

const UserHeaderContainer = styled.div`
  display: grid;
  grid-template-areas: 'avatar title' 'avatar subtitle';
  grid-template-columns: min-content auto;
  grid-template-rows: min-content min-content;
  grid-gap: 0 0.5em;
  padding: 1em;
  ${({ hasNoChildren }) =>
    hasNoChildren &&
    css`
      grid-template-areas: 'avatar title';
      align-items: center;
    `}
`;

const UserHeaderAvatar = styled(Avatar)`
  grid-area: avatar;
`;

const UserHeaderTitle = styled.div`
  grid-area: title;
  ${({ theme }) => theme.typography.title}
`;

const UserHeaderSubtitle = styled.div`
  grid-area: subtitle;
  ${({ theme }) => theme.typography.body}
`;

const UserHeader = ({ userId, displayName, avatarFileUrl, children, onClick }) => {
  const onClickUser = () => onClick(userId);
  return (
    <UserHeaderContainer title={displayName} hasNoChildren={!children}>
      <UserHeaderAvatar avatar={avatarFileUrl} onClick={onClickUser} />
      <UserHeaderTitle title={userId} onClick={onClickUser}>
        {displayName}
      </UserHeaderTitle>
      {children && <UserHeaderSubtitle>{children}</UserHeaderSubtitle>}
    </UserHeaderContainer>
  );
};

UserHeader.propTypes = {
  userId: PropTypes.string,
  displayName: PropTypes.string,
  avatarFileUrl: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

export default customizableComponent('UserHeader', UserHeader);
