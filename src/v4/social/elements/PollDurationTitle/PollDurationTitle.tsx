import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

type PollDurationTitleProps = {
  pageId?: string;
  componentId?: string;
};

export const PollDurationTitle = ({ pageId = '*', componentId = '*' }: PollDurationTitleProps) => {
  const elementId = 'poll_duration_title';

  const { config, themeStyles, accessibilityId, resolveText, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  // Owned by a module. A reusable element can be rendered on any page,
  // including one another module owns, so it answers for itself.
  if (isExcluded) return null;
  return (
    <Typography.TitleBold data-testid={accessibilityId} style={themeStyles}>
      {resolveText('amity_social_button_poll_duration')}
    </Typography.TitleBold>
  );
};
