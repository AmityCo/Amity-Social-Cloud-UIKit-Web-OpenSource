import { Typography } from '~/v4/core/components';
import { SearchResult } from '~/v4/icons/SearchResult';
import styles from './SearchLimit.module.css';

export function SearchLimit() {
  return (
    <div className={styles.searchLimit}>
      <SearchResult className={styles.searchLimit__icon} />
      <Typography.TitleBold className={styles.searchLimit__title}>
        Start your search by typing at least 3 letters
      </Typography.TitleBold>
    </div>
  );
}
