import React from 'react';
import { customizableComponent } from 'hocs/customization';

import withSize from 'hocs/withSize';
import { AvatarContainer, Img } from './styles';

const Avatar = withSize(({ avatar, ...props }) => (
  <AvatarContainer {...props}>{avatar && <Img src={avatar} />}</AvatarContainer>
));

export default customizableComponent('Avatar', Avatar);
