import { useNetworkState } from 'react-use';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { useString } from '~/v4/core/localization';
import { Loader } from '~/v4/core/design/atoms/Loader';
import styles from './WaitingForNetwork.module.css';

export function WaitingForNetwork() {
  const { online } = useNetworkState();
  const label = useString('amity_chat_waiting_for_network');

  if (online !== false) return null;

  return (
    <div className={styles.waitingForNetwork}>
      <Loader.Spinner size="sm" />
      <Typography.Caption className={styles.waitingForNetwork__text}>{label}</Typography.Caption>
    </div>
  );
}
