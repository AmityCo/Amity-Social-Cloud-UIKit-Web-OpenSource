import BlockedUser from '~/v4/icons/BlockedUser';
import { EmptyContent } from '~/v4/social/internal-components/EmptyContent';
import styles from './BlockedUserMediaFeed.module.css';

type BlockedUserMediaFeedProps = {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  infoElementId?: string;
};

export function BlockedUserMediaFeed({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  infoElementId = '*',
}: BlockedUserMediaFeedProps) {
  return (
    <EmptyContent
      pageId={pageId}
      componentId={componentId}
      elementId={elementId}
      infoElementId={infoElementId}
      emptyContentClassName={styles.blockedUserMediaFeed}
      defaultIcon={() => <BlockedUser className={styles.blockedUserMediaFeed__icon} />}
    />
  );
}
