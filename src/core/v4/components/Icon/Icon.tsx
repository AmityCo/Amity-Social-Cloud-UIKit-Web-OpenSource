import React from 'react';
import * as Icons from '~/icons';

type IconName = keyof typeof Icons;

export interface IconProps {
  name: IconName | null;
  id?: string;
  size?: number;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, style, onClick, ...props }) => {
  const iconMap = {
    ...Icons,
  };

  const IconComponent = iconMap[name as keyof typeof iconMap];

  if (!IconComponent) {
    console.error(`Icon not found: ${name}`);
    return null;
  }

  return (
    <IconComponent
      data-qa-anchor={`${name}-icon`}
      width={size}
      height={size}
      style={style}
      onClick={onClick}
      {...props}
    />
  );
};
