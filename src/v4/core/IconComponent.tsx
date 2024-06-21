import React from 'react';
import { Button, PressEvent } from 'react-aria-components';

export interface IconComponentProps {
  defaultIcon: () => JSX.Element;
  imgIcon: () => JSX.Element;
  onPress?: (e: PressEvent) => void;
  defaultIconName?: string;
  configIconName?: string;
  'data-qa-anchor'?: string;
  style?: React.CSSProperties;
  className?: string;
}

export const IconComponent = ({
  defaultIcon,
  imgIcon,
  onPress,
  style,
  defaultIconName,
  configIconName,
  className,
}: IconComponentProps) => {
  return (
    <Button className={className} data-qa-anchor={'data-qa-anchor'} onPress={onPress} style={style}>
      {defaultIconName === configIconName ? defaultIcon() : imgIcon()}
    </Button>
  );
};
