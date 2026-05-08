import PrivateFeed from '~/v4/icons/PrivateFeed';
import { EmptyContent } from '~/v4/social/internal-components/EmptyContent';
import styles from './PrivateUserMediaFeed.module.css';

interface PrivateUserMediaFeedProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  infoElementId?: string;
  textKey?: string;
  infoTextKey?: string;
}

export function PrivateUserMediaFeed({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  infoElementId = '*',
  textKey,
  infoTextKey,
}: PrivateUserMediaFeedProps) {
  return (
    <EmptyContent
      pageId={pageId}
      componentId={componentId}
      elementId={elementId}
      infoElementId={infoElementId}
      textKey={textKey}
      infoTextKey={infoTextKey}
      emptyContentClassName={styles.privateUserMediaFeed}
      defaultIcon={() => <PrivateFeed className={styles.privateUserMediaFeed__icon} />}
    />
  );
}
