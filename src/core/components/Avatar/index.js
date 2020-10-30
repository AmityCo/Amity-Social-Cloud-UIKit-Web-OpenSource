import React, { useState, useEffect, useCallback } from 'react';
import cx from 'classnames';

import customizableComponent from '~/core/hocs/customization';
import ConditionalRender from '~/core/components/ConditionalRender';
import withSize from '~/core/hocs/withSize';

import { AvatarContainer, Img, AvatarOverlay } from './styles';

const Avatar = ({ className, avatar = null, showOverlay, ...props }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
  }, [avatar]);

  const onLoad = useCallback(() => setVisible(true), []);
  const onError = useCallback(() => setVisible(false), []);

  return (
    <AvatarContainer className={cx(className, { visible })} {...props}>
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
