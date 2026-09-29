import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

type PollOptionsTitleProps = {
  pageId?: string;
  componentId?: string;
};

export const PollOptionsTitle = ({ pageId = '*', componentId = '*' }: PollOptionsTitleProps) => {
  const elementId = 'poll_options_title';
  const { accessibilityId, themeStyles, config, resolveText, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  // Owned by a module. A reusable element can be rendered on any page,
  // including one another module owns, so it answers for itself.
  if (isExcluded) return null;
  return (
    <Typography.TitleBold style={themeStyles} data-testid={accessibilityId}>
      {resolveText('amity_social_button_options')}
    </Typography.TitleBold>
  );
};
