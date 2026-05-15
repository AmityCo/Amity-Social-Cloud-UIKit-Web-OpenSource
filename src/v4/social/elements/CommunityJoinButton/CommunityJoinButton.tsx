import React from 'react';
import { Button, ButtonProps } from '~/v4/core/components/AriaButton';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Plus as PlusIcon } from '~/v4/icons/Plus';
import clsx from 'clsx';

type CommunityJoinButtonProps = ButtonProps & {
  pageId?: string;
  className?: string;
  componentId?: string;
  onClick?: () => void;
  defaultClassName?: string;
};

export const CommunityJoinButton = ({
  onClick,
  className,
  pageId = '*',
  defaultClassName,
  componentId = '*',
  ...props
}: CommunityJoinButtonProps) => {
  const elementId = 'community_join_button';
  const {
    config,
    themeStyles,
    accessibilityId,
    isExcluded,
    uiReference,
    defaultConfig,
    resolveText,
  } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button
      size="small"
      variant="fill"
      color="primary"
      onPress={onClick}
      style={themeStyles}
      className={className}
      data-testid={accessibilityId}
      icon={({ className }) => (
        <IconComponent
          configIconName={config.icon}
          defaultIconName={defaultConfig.icon}
          imgIcon={() => <img src={config.icon} alt={uiReference} />}
          defaultIcon={() => <PlusIcon className={clsx(className, defaultClassName)} />}
        />
      )}
      {...props}
    >
      {resolveText('amity_common_join')}
    </Button>
  );
};
