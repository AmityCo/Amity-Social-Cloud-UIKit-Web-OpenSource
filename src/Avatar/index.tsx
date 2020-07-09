import React, { useState } from 'react';
import { customizableComponent } from '../hoks/customization';

import { AvatarContainer } from './styles';

const Avatar = ({ className }) => <AvatarContainer className={className} />;

export default customizableComponent('Avatar')(Avatar);
