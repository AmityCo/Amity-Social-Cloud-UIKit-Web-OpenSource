import clsx from 'clsx';
import React from 'react';
import Check from '~/v4/icons/Check';
import { Typography } from '~/v4/core/components';
import { IconComponent } from '~/v4/core/IconComponent';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button } from '~/v4/core/components/AriaButton';

type CommunityJoinedButtonProps = {
  pageId?: string;
  componentId?: string;
  onClick?: () => void;
  className?: string;
  defaultClassName?: string;
};

export const CommunityJoinedButton = ({
  onClick,
  className,
  pageId = '*',
  defaultClassName,
  componentId = '*',
}: CommunityJoinedButtonProps) => {
  const elementId = 'community_joined_button';
  const { config, themeStyles, accessibilityId, isExcluded, uiReference, defaultConfig } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <Button
      size="small"
      color="secondary"
      onPress={onClick}
      variant="outlined"
      style={themeStyles}
      className={className}
      data-testid={accessibilityId}
      icon={({ className }) => (
        <IconComponent
          configIconName={config.icon}
          defaultIconName={defaultConfig.icon}
          imgIcon={() => <img src={config.icon} alt={uiReference} />}
          defaultIcon={() => <Check className={clsx(className, defaultClassName)} />}
        />
      )}
    >
      <Typography.CaptionBold>{config.text}</Typography.CaptionBold>
    </Button>
  );
};
