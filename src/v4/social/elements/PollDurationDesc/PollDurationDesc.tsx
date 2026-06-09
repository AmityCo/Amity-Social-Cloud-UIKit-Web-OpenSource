import styles from './PollDurationDesc.module.css';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';

type PollDurationDescProps = {
  pageId?: string;
  componentId?: string;
};

export const PollDurationDesc = ({ pageId = '*', componentId = '*' }: PollDurationDescProps) => {
  const elementId = 'poll_duration_desc';

  const { config, themeStyles, accessibilityId, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });
  return (
    <Typography.Caption
      data-testid={accessibilityId}
      style={themeStyles}
      className={styles.pollDurationDesc__text}
    >
      {resolveText('amity_social_label_you_can_always_close_the_poll_before_the_set_duration')}
    </Typography.Caption>
  );
};
