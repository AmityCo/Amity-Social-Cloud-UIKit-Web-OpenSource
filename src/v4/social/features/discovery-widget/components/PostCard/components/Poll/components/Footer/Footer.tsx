import { Typography } from '~/v4/core/components';
import { useString } from '~/v4/core/localization';
import { calculateRemainingFromMs } from '~/v4/social/utils/calculateRemainingFromMs';
import { getVoterCountText } from '~/v4/social/features/discovery-widget/utils';
import styles from './Footer.module.css';

type FooterProps = {
  voteCount: number;
  isEnded: boolean;
  closedInMs?: number;
};

export function Footer({ voteCount, isEnded, closedInMs }: FooterProps) {
  const seeFullResults = useString('amity_social_label_see_full_results');
  const endedLabel = useString('amity_social_event_detail_status_ended');

  const votesText = getVoterCountText(voteCount);

  const statusText =
    isEnded || typeof closedInMs !== 'number' ? endedLabel : calculateRemainingFromMs(closedInMs);

  return (
    <div className={styles.footer}>
      <div className={styles.footer__seeFullResults} aria-hidden="true">
        <Typography.BodyBold className={styles.footer__seeFullResultsLabel}>
          {seeFullResults}
        </Typography.BodyBold>
      </div>
      <div className={styles.footer__status}>
        <Typography.CaptionBold className={styles.footer__statusText}>
          {votesText}
        </Typography.CaptionBold>
        <Typography.CaptionBold className={styles.footer__separator}>•</Typography.CaptionBold>
        <Typography.CaptionBold className={styles.footer__statusText}>
          {statusText}
        </Typography.CaptionBold>
      </div>
    </div>
  );
}
