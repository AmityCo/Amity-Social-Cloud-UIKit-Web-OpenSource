import React from 'react';
import { Button, ButtonProps } from '~/v4/core/components/AriaButton';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Typography } from '~/v4/core/components/Typography';

type IconButtonProps = ButtonProps & {
  pageId?: string;
  className?: string;
  componentId?: string;
  onClick?: () => void;
  defaultClassName?: string;
  elementId?: string;
  defaultIcon: JSX.Element;
  text?: string;
};

export const IconButton = ({
  onClick,
  className,
  pageId = '*',
  defaultClassName,
  componentId = '*',
  elementId = '*',
  defaultIcon,
  text = '',
  ...props
}: IconButtonProps) => {
  const { config, themeStyles, accessibilityId, isExcluded, uiReference, defaultConfig } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Button
      className={className}
      size={props.size || 'small'}
      variant={props.variant || 'fill'}
      color={props.color || 'primary'}
      onPress={onClick}
      style={themeStyles}
      data-testid={accessibilityId}
      icon={() => (
        <IconComponent
          configIconName={config.image}
          defaultIconName={defaultConfig.image}
          imgIcon={() => <img src={config.image} alt={uiReference} />}
          defaultIcon={() => defaultIcon}
        />
      )}
      {...props}
    >
      <Typography.BodyBold>{config.text ? config.text : text}</Typography.BodyBold>
    </Button>
  );
};
