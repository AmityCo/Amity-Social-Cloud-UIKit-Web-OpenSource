import React from 'react';
import { Typography, TypographyVariant } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

interface TextElementProps {
  pageId?: string;
  componentId?: string;
  elementId: string;
  className?: string;
  labelText?: string;
  textKey?: string;
  variant: TypographyVariant;
}

const TypographyComponentMap = {
  [TypographyVariant.Headline]: Typography.Headline,
  [TypographyVariant.TitleBold]: Typography.TitleBold,
  [TypographyVariant.Title]: Typography.Title,
  [TypographyVariant.BodyBold]: Typography.BodyBold,
  [TypographyVariant.Body]: Typography.Body,
  [TypographyVariant.CaptionBold]: Typography.CaptionBold,
  [TypographyVariant.Caption]: Typography.Caption,
  [TypographyVariant.CaptionSmall]: Typography.CaptionSmall,
};

export function TextElement({
  pageId = '*',
  componentId = '*',
  elementId,
  className,
  labelText,
  textKey,
  variant,
}: TextElementProps) {
  const { accessibilityId, config, isExcluded, themeStyles, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  const Component = TypographyComponentMap[variant];
  const text = textKey ? resolveText(textKey) : config.text ?? labelText;

  return (
    <Component className={className} style={themeStyles} data-testid={accessibilityId}>
      {text}
    </Component>
  );
}
