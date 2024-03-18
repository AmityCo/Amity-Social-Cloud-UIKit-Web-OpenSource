import React from 'react';
import { StyledBadge } from './styles';
import { BadgeProps } from './types';

export const Badge = ({ icon, communityRole }: BadgeProps) => {
  return (
    <StyledBadge>
      {icon}
      {communityRole}
    </StyledBadge>
  );
};
