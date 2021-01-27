import React, { useState, useCallback } from 'react';
import cx from 'classnames';

import customizableComponent from '~/core/hocs/customization';
import ConditionalRender from '~/core/components/ConditionalRender';
import withSize from '~/core/hocs/withSize';

import { AvatarContainer, Img, AvatarOverlay } from './styles';

const Avatar = ({ className, avatar = null, showOverlay, onClick, ...props }) => {
  const [visible, setVisible] = useState(false);

  const onLoad = useCallback(() => setVisible(true), []);
  const onError = useCallback(() => setVisible(false), []);

  return (
    <AvatarContainer
      className={cx(className, { visible, clickable: !!onClick })}
      onClick={onClick}
      {...props}
    >
      <ConditionalRender condition={avatar && showOverlay}>
        <AvatarOverlay {...props}>
          <Img src={avatar} onLoad={onLoad} onError={onError} />
        </AvatarOverlay>
        <Img src={avatar} onLoad={onLoad} onError={onError} />
      </ConditionalRender>
    </AvatarContainer>
  );
};

export default customizableComponent('Avatar', withSize(Avatar));
