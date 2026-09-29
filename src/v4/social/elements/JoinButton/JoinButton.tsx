import React from 'react';
import { resolveString } from '~/v4/core/localization';
import { Button, ButtonProps } from '~/v4/core/components/AriaButton';
import { useAmityElement } from '~/v4/core/hooks/uikit';

type JoinButtonProps = ButtonProps & {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  textId?: string;
  testId?: string;
};

export const JoinButton = ({
  pageId = '*',
  componentId = '*',
  elementId: $elementId,
  textId = 'amity_social_accept_button',
  testId,
  ...props
}: JoinButtonProps) => {
  const elementId = $elementId ? $elementId : 'join_button';
  const { config, themeStyles, accessibilityId, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  // Owned by a module. A reusable element can be rendered on any page,
  // including one another module owns, so it answers for itself.
  if (isExcluded) return null;

  return (
    <Button
      {...props}
      fullWidth
      type="button"
      size="medium"
      variant="fill"
      color="primary"
      style={themeStyles}
      data-testid={testId ?? accessibilityId}
    >
      {resolveString(textId) || config.text}
    </Button>
  );
};
