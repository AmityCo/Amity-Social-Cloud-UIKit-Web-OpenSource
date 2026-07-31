import clsx from 'clsx';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { useString } from '~/v4/core/localization';
import { NewspaperQuestion } from '~/v4/core/design/icons/NewspaperQuestion';
import styles from './FailedToShow.module.css';

type FailedToShowProps = {
  className?: string;
};

export function FailedToShow({ className }: FailedToShowProps) {
  const title = useString('amity_social_label_livestream_deleted_page_title');
  const description = useString('amity_social_button_livestream_unavailable_desc');

  return (
    <div className={clsx(styles.failedToShow, className)}>
      <NewspaperQuestion.Light
        className={styles.failedToShow__icon}
        role="img"
        aria-label={title}
      />
      <Typography.TitleBold className={styles.failedToShow__title}>{title}</Typography.TitleBold>
      <Typography.Body className={styles.failedToShow__desc}>{description}</Typography.Body>
    </div>
  );
}
