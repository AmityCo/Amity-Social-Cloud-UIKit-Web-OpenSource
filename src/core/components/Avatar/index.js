import React, { useState, useEffect, useCallback } from 'react';
import cx from 'classnames';

import { customizableComponent } from '~/core/hocs/customization';
import withSize from '~/core/hocs/withSize';

import { AvatarContainer, Img } from './styles';

const Avatar = ({ className, avatar = null, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(false);
  }, [avatar]);
  const onLoad = useCallback(() => setLoaded(true), []);

  return (
    <AvatarContainer className={cx(className, { loaded })} {...props}>
      {avatar ? <Img src={avatar} onLoad={onLoad} onError={onLoad} /> : null}
    </AvatarContainer>
  );
};

export default customizableComponent('Avatar', withSize(Avatar));
