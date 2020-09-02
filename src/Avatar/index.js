import React from 'react';
import { customizableComponent } from '../hoks/customization';

import { AvatarContainer, Img } from './styles';

const STANDARD_SIZE = 40;

const SIZES = {
  big: 64,
  small: 32,
  tiny: 28,
};

const Avatar = ({ className, size, avatar }) => (
  <AvatarContainer size={SIZES[size] || STANDARD_SIZE} className={className}>
    {avatar && <Img src={avatar} />}
  </AvatarContainer>
);

export default customizableComponent('Avatar')(Avatar);
