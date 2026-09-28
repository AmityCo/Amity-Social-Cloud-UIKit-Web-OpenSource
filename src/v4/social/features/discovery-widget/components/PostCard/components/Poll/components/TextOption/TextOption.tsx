import { Typography } from '~/v4/core/components';
import {
  getParticipantLineText,
  formatPercentage,
  type SortedPollAnswer,
} from '~/v4/social/features/discovery-widget/utils';
import { ProgressBar } from '~/v4/social/features/discovery-widget/components/PostCard/components/Poll/components/ProgressBar';
import styles from './TextOption.module.css';

type TextOptionProps = {
  answer: SortedPollAnswer;
  percentage: number;
};

export function TextOption({ answer, percentage }: TextOptionProps) {
  return (
    <div className={styles.textOption} data-leading={answer.isLeading}>
      <div className={styles.textOption__details}>
        <div className={styles.textOption__row}>
          <Typography.BodyBold className={styles.textOption__label}>
            {answer.data}
          </Typography.BodyBold>
          <Typography.BodyBold
            className={styles.textOption__percentage}
            data-leading={answer.isLeading}
          >
            {formatPercentage(percentage)}
          </Typography.BodyBold>
        </div>
        <Typography.Caption className={styles.textOption__voterLine}>
          {getParticipantLineText(answer.voteCount)}
        </Typography.Caption>
      </div>
      <ProgressBar percentage={percentage} isLeading={answer.isLeading} />
    </div>
  );
}
