import { useState } from 'react';
import { Typography } from '~/v4/core/components';
import { getFileUrlWithSize } from '~/v4/utils/getFileUrlWithSize';
import { BrokenImage } from '~/v4/icons/BrokenImage';
import Expand from '~/v4/icons/Expand';
import {
  getVoterCountText,
  formatPercentage,
  type SortedPollAnswer,
} from '~/v4/social/features/content-widget/utils';
import styles from './ImageOption.module.css';

type ImageOptionProps = {
  answer: SortedPollAnswer;
  percentage: number;
};

export function ImageOption({ answer, percentage }: ImageOptionProps) {
  const [isBroken, setIsBroken] = useState(false);
  const imageUrl = answer.image?.fileUrl ? getFileUrlWithSize(answer.image.fileUrl) : undefined;

  return (
    <div className={styles.imageOption} data-leading={answer.isLeading}>
      <div className={styles.imageOption__thumbnail}>
        {imageUrl && !isBroken ? (
          <img
            src={imageUrl}
            alt=""
            aria-hidden="true"
            className={styles.imageOption__image}
            onError={() => setIsBroken(true)}
          />
        ) : (
          <div className={styles.imageOption__broken}>
            <BrokenImage className={styles.imageOption__brokenIcon} />
          </div>
        )}
        <div className={styles.imageOption__scrim} aria-hidden="true" />
        <div className={styles.imageOption__expand} aria-hidden="true">
          <Expand className={styles.imageOption__expandIcon} />
        </div>
        <Typography.Headline className={styles.imageOption__percentage}>
          {formatPercentage(percentage)}
        </Typography.Headline>
      </div>
      <div className={styles.imageOption__labels}>
        <Typography.BodyBold className={styles.imageOption__caption}>
          {answer.data}
        </Typography.BodyBold>
        <Typography.Caption className={styles.imageOption__voterLine}>
          {getVoterCountText(answer.voteCount)}
        </Typography.Caption>
      </div>
    </div>
  );
}
