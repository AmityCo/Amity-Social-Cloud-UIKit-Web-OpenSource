import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import { Loader } from '@noom/wax-component-library';
import customizableComponent from '~/core/hocs/customization';
import { backgroundImage as UserImage } from '~/icons/User';
import BanIcon from '~/icons/Ban';
import Avatar from '~/core/components/Avatar';

const UserHeaderContainer = styled.div`
  display: grid;
  grid-template-areas: 'avatar title' 'avatar subtitle';
  grid-template-columns: min-content auto;
  grid-template-rows: min-content min-content;
  grid-gap: 0 0.5em;
  padding: 0.5rem;
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

  ${({ theme }) => theme.typography.bodyBold}
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const UserHeaderSubtitle = styled.div`
  grid-area: subtitle;
  ${({ theme }) => theme.typography.body}
`;

const UserHeaderId = styled.div`
  grid-area: subtitle;
  ${({ theme }) => theme.typography.body}
  text-align: left;
  font-size: 0.7em;
`;

const UserHeader = ({
  userId,
  showId,
  showName = true,
  displayName,
  avatarFileUrl,
  children,
  onClick,
  isBanned,
  isLoading,
}) => {
  const onClickUser = () => onClick(userId);
  return (
    <UserHeaderContainer title={displayName} hasNoChildren={!children}>
      <UserHeaderAvatar
        displayName={displayName}
        avatar={avatarFileUrl}
        backgroundImage={UserImage}
        onClick={onClickUser}
      />

      <UserHeaderTitle title={userId} onClick={onClickUser}>
        {isLoading ? (
          <Loader colorScheme="primary" size="xs" />
        ) : (
          <>
            {showName ? displayName : ''} {isBanned && <BanIcon width={14} height={14} />}
          </>
        )}
        {showId && <UserHeaderId>{userId}</UserHeaderId>}
      </UserHeaderTitle>
      {children && <UserHeaderSubtitle>{children}</UserHeaderSubtitle>}
    </UserHeaderContainer>
  );
};

UserHeader.propTypes = {
  showId: PropTypes.bool,
  showName: PropTypes.bool,
  userId: PropTypes.string,
  displayName: PropTypes.string,
  avatarFileUrl: PropTypes.string,
  children: PropTypes.node,
  isBanned: PropTypes.bool,
  onClick: PropTypes.func,
};

export default customizableComponent('UserHeader', UserHeader);
