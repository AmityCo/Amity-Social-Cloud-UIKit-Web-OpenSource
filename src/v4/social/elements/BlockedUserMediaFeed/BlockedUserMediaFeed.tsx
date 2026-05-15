import BlockedUser from '~/v4/icons/BlockedUser';
import { EmptyContent } from '~/v4/social/internal-components/EmptyContent';
import styles from './BlockedUserMediaFeed.module.css';

type BlockedUserMediaFeedProps = {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  infoElementId?: string;
  textKey?: string;
  infoTextKey?: string;
};

export function BlockedUserMediaFeed({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  infoElementId = '*',
  textKey,
  infoTextKey,
}: BlockedUserMediaFeedProps) {
  return (
    <EmptyContent
      pageId={pageId}
      componentId={componentId}
      elementId={elementId}
      infoElementId={infoElementId}
      textKey={textKey}
      infoTextKey={infoTextKey}
      emptyContentClassName={styles.blockedUserMediaFeed}
      defaultIcon={() => <BlockedUser className={styles.blockedUserMediaFeed__icon} />}
    />
  );
}
