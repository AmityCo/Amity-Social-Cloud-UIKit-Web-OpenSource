import ErrorFeed from '~/v4/icons/ErrorFeed';
import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import styles from './ErrorContent.module.css';

type ErrorContentProps = {
  type?: 'media' | 'post';
};

export const ErrorContent = ({ type }: ErrorContentProps) => {
  return (
    <div className={styles.errorContent__container} data-type={type}>
      <ErrorFeed className={styles.errorContent__icon} />
      <div className={styles.errorContent__text}>
        <Typography.TitleBold>
          {useString('amity_social_label_livestream_deleted_page_title')}
        </Typography.TitleBold>
        <Typography.Caption>{useString('amity_social_label_please_try_again')}</Typography.Caption>
      </div>
    </div>
  );
};
