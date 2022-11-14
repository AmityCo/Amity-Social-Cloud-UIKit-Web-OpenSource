import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import { Avatar as WAXAvatar } from '@noom/wax-component-library';

import customizableComponent from '~/core/hocs/customization';
import withSize from '~/core/hocs/withSize';
import { backgroundImage as UserImage } from '~/icons/User';
import { SIZE_TO_WAX } from '~/core/hocs/withSize';
import { CommunityNoom } from '~/icons';

import { AvatarContainer, AvatarOverlay } from './styles';

const Avatar = ({
  className,
  avatar = null,
  showOverlay,
  size,
  onClick,
  loading,
  displayName,
  backgroundImage,
  isCommunity,
  isLazy,
  ...props
}) => {
  const communityProps = isCommunity ? { icon: <CommunityNoom p={1} color="white" /> } : {};

  return (
    <AvatarContainer
      className={cx(className, { clickable: !!onClick })}
      loading={loading}
      size={size}
      onClick={onClick}
      {...props}
    >
      {avatar && showOverlay ? (
        <AvatarOverlay {...props}>
          <WAXAvatar
            {...communityProps}
            size={SIZE_TO_WAX[size]}
            src={avatar || backgroundImage}
            name={displayName}
            h="100%"
            w="100%"
            loading={isLazy ? 'lazy' : 'eager'}
          />
        </AvatarOverlay>
      ) : (
        <WAXAvatar
          {...communityProps}
          size={SIZE_TO_WAX[size]}
          src={avatar || backgroundImage}
          name={displayName}
          h="100%"
          w="100%"
          loading={isLazy ? 'lazy' : 'eager'}
        />
      )}
    </AvatarContainer>
  );
};

Avatar.defaultProps = {
  backgroundImage: UserImage,
  loading: false,
  isCommunity: false,
};

export default customizableComponent('Avatar', withSize(Avatar));
