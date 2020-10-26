import React, { useState, useEffect, useCallback } from 'react';
import cx from 'classnames';

import customizableComponent from '~/core/hocs/customization';
import withSize from '~/core/hocs/withSize';

import { AvatarContainer, Img } from './styles';

const Avatar = ({ className, avatar = null, ...props }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
  }, [avatar]);

  const onLoad = useCallback(() => setVisible(true), []);
  const onError = useCallback(() => setVisible(false), []);

  return (
    <AvatarContainer className={cx(className, { visible })} {...props}>
      {avatar ? <Img src={avatar} onLoad={onLoad} onError={onError} /> : null}
    </AvatarContainer>
  );
};

export default customizableComponent('Avatar', withSize(Avatar));
