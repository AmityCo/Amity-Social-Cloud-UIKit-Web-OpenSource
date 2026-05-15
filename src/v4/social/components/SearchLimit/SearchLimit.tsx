import { Typography } from '~/v4/core/components';
import { useString } from '~/v4/core/localization';
import { SearchResult } from '~/v4/icons/SearchResult';
import styles from './SearchLimit.module.css';

export function SearchLimit() {
  return (
    <div className={styles.searchLimit}>
      <SearchResult className={styles.searchLimit__icon} />
      <Typography.TitleBold className={styles.searchLimit__title}>
        {useString('amity_social_placeholder_community_search_placeholder')}
      </Typography.TitleBold>
    </div>
  );
}
