import React from 'react';

export interface IconComponentProps {
  defaultIcon: () => JSX.Element;
  imgIcon: () => JSX.Element;
  onClick?: (e: React.MouseEvent) => void;
  defaultIconName?: string;
  configIconName?: string;
  'data-qa-anchor'?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const IconComponent = ({
  defaultIcon,
  imgIcon,
  onClick,
  style,
  defaultIconName,
  configIconName,
  className,
}: IconComponentProps) => {

  return (
    <button className={className} data-qa-anchor={'data-qa-anchor'} onClick={onClick} style={style}>
      {defaultIconName === configIconName ? defaultIcon() : imgIcon()}
    </button>
  );
};
