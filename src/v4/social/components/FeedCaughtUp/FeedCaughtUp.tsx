import CheckCircleOutline from '~/v4/icons/CheckCircleOutline';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useString } from '~/v4/core/localization';
import { Button } from '~/v4/core/components/AriaButton';
import { Typography } from '~/v4/core/components/Typography';
import { COMPONENT_ID } from '~/v4/constants/customization';
import styles from './FeedCaughtUp.module.css';

type FeedCaughtUpProps = {
  pageId?: string;
  componentId?: string;
  title?: string;
  ctaLabel?: string;
  onSwitchRequested: () => void;
};

export function FeedCaughtUp({
  pageId = '*',
  componentId = COMPONENT_ID.FEED_CAUGHT_UP_COMPONENT,
  title,
  ctaLabel,
  onSwitchRequested,
}: FeedCaughtUpProps) {
  const { accessibilityId, themeStyles, isExcluded } = useAmityComponent({ pageId, componentId });

  const titleText = useString('amity_social_feed_caught_up_title');

  const ctaText = useString('amity_social_feed_caught_up_cta');

  const ariaLabel = useString('amity_social_feed_caught_up_aria_label');

  if (isExcluded) return null;

  return (
    <section
      aria-label={ariaLabel}
      className={styles.feedCaughtUp}
      style={themeStyles}
      data-testid={accessibilityId}
    >
      <CheckCircleOutline className={styles.feedCaughtUp__icon} />
      <Typography.TitleBold className={styles.feedCaughtUp__title}>
        {title ?? titleText}
      </Typography.TitleBold>
      <Button
        color="primary"
        variant="text"
        onPress={onSwitchRequested}
        className={styles.feedCaughtUp__cta}
      >
        {ctaLabel ?? ctaText}
      </Button>
    </section>
  );
}
