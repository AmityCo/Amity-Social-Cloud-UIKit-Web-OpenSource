import React, { useState, useCallback } from 'react';
import cx from 'classnames';

import customizableComponent from '~/core/hocs/customization';
import ConditionalRender from '~/core/components/ConditionalRender';
import withSize from '~/core/hocs/withSize';
import { backgroundImage as UserImage } from '~/icons/User';

import { AvatarContainer, Img, AvatarOverlay } from './styles';

const Avatar = ({ className, avatar = null, showOverlay, size, onClick, ...props }) => {
  const [visible, setVisible] = useState(false);

  const onLoad = useCallback(() => setVisible(true), []);
  const onError = useCallback(() => setVisible(false), []);

  return (
    <AvatarContainer
      className={cx(className, { visible, clickable: !!onClick })}
      onClick={onClick}
      size={size}
      {...props}
    >
      <ConditionalRender condition={avatar && showOverlay}>
        <AvatarOverlay {...props}>
          <Img onError={onError} onLoad={onLoad} src={avatar} />
        </AvatarOverlay>
        <Img onError={onError} onLoad={onLoad} src={avatar} />
      </ConditionalRender>
    </AvatarContainer>
  );
};

Avatar.defaultProps = {
  backgroundImage: UserImage,
};

export default customizableComponent('Avatar', withSize(Avatar));
