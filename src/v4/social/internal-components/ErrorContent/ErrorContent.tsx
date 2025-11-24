import ErrorFeed from '~/v4/icons/ErrorFeed';
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
        <Typography.TitleBold>Something went wrong</Typography.TitleBold>
        <Typography.Caption>Please try again.</Typography.Caption>
      </div>
    </div>
  );
};
