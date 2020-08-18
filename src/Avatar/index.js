import React, { useState } from 'react';
import { customizableComponent } from '../hoks/customization';

import { AvatarContainer } from './styles';

const STANDARD_SIZE = 40;

const SIZES = {
  big: 64,
  small: 32,
  tiny: 28,
};

const Avatar = ({ className, size }) => (
  <AvatarContainer size={SIZES[size] || STANDARD_SIZE} className={className} />
);

export default customizableComponent('Avatar')(Avatar);
