import React, { useState, useCallback } from 'react';
import cx from 'classnames';
import { Avatar as WAXAvatar } from '@noom/wax-component-library';

import customizableComponent from '~/core/hocs/customization';
import withSize from '~/core/hocs/withSize';
import { backgroundImage as UserImage } from '~/icons/User';
import { SIZE_TO_WAX } from '~/core/hocs/withSize';

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
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  const onLoad = useCallback(() => setVisible(true), []);
  const onError = useCallback(() => setVisible(false), []);

  return (
    <AvatarContainer
      className={cx(className, { visible, clickable: !!onClick })}
      loading={loading}
      size={size}
      onClick={onClick}
      {...props}
    >
      {avatar && showOverlay ? (
        <AvatarOverlay {...props}>
          <WAXAvatar
            size={SIZE_TO_WAX[size]}
            src={avatar || backgroundImage}
            name={displayName}
            h="100%"
            w="100%"
          />
        </AvatarOverlay>
      ) : (
        <WAXAvatar
          size={SIZE_TO_WAX[size]}
          src={avatar || backgroundImage}
          name={displayName}
          h="100%"
          w="100%"
        />
      )}
    </AvatarContainer>
  );
};

Avatar.defaultProps = {
  backgroundImage: UserImage,
  loading: false,
};

export default customizableComponent('Avatar', withSize(Avatar));
