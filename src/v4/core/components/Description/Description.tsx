import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Typography, TypographyProps } from '~/v4/core/components';
import { useString } from '~/v4/core/localization';

type DescriptionProps = TypographyProps & {
  pageId?: string;
  componentId?: string;
  elementId: string;
  textId?: string;
  className?: string;
};

export const Description = ({
  className,
  pageId = '*',
  componentId = '*',
  elementId,
  textId,
  ...props
}: DescriptionProps) => {
  const { accessibilityId, themeStyles, config, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Typography.BodyBold
      {...props}
      style={themeStyles}
      data-testid={accessibilityId}
      className={className}
    >
      {textId ? useString(textId) : config.text}
    </Typography.BodyBold>
  );
};
