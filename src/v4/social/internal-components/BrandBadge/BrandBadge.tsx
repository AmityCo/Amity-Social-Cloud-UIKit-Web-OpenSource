import React from 'react';
import Brand from '~/v4/icons/Brand';

interface BrandBadgeProps {
  className?: string;
}

export const BrandBadge = ({ className }: BrandBadgeProps) => {
  return <Brand className={className} />;
};
