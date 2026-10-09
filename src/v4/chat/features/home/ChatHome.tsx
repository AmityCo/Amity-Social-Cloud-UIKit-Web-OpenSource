import { useMemo, useState } from 'react';
import type { Key } from 'react-aria-components';
import { Tabs } from '~/v4/core/design/molecules/Tabs';
import { useString } from '~/v4/core/localization';
import { Header } from '~/v4/chat/features/home/components/Header/Header';
import { ChannelList } from '~/v4/chat/features/home/components/ChannelList/ChannelList';
import { NotificationsDisabledBanner } from '~/v4/chat/features/home/components/NotificationsDisabledBanner/NotificationsDisabledBanner';
import { useChatFeatureFlags } from '~/v4/chat/hooks/useChatFeatureFlags';
import { useUserPushNotificationQuery } from '~/v4/chat/hooks/queries/useUserPushNotificationQuery';
import styles from './ChatHome.module.css';

type ChatHomeProps = {
  /** The page is mounted but not shown; see `ChatHomePage`. */
  hidden?: boolean;
};

export function ChatHome({ hidden = false }: ChatHomeProps = {}) {
  const { enabledChannelTypes } = useChatFeatureFlags();

  const hasConversation = enabledChannelTypes.includes('conversation');
  const hasCommunity = enabledChannelTypes.includes('community');
  const showBoth = hasConversation && hasCommunity;

  const defaultTab = showBoth ? 'all' : hasConversation ? 'direct' : 'group';
  const [activeTab, setActiveTab] = useState<Key>(defaultTab);

  const allLabel = useString('amity_chat_tab_all');
  const directLabel = useString('amity_chat_tab_direct');
  const groupsLabel = useString('amity_chat_tab_groups');

  const tabs = useMemo(() => {
    const allTab = {
      value: 'all',
      label: allLabel,
      testId: 'chat-tab-all',
      content: () => <ChannelList types={['conversation', 'community']} hidden={hidden} />,
    };
    const directTab = {
      value: 'direct',
      label: directLabel,
      testId: 'chat-tab-direct',
      content: () => <ChannelList types={['conversation']} hidden={hidden} />,
    };
    const groupsTab = {
      value: 'group',
      label: groupsLabel,
      testId: 'chat-tab-group',
      content: () => <ChannelList types={['community']} hidden={hidden} />,
    };

    if (!showBoth) {
      return hasConversation ? [directTab] : [groupsTab];
    }

    const typeTabsInOrder =
      enabledChannelTypes[0] === 'conversation' ? [directTab, groupsTab] : [groupsTab, directTab];

    return [allTab, ...typeTabsInOrder];
  }, [showBoth, hasConversation, enabledChannelTypes, allLabel, directLabel, groupsLabel, hidden]);

  const { isChatNotificationDisabled } = useUserPushNotificationQuery();

  const showNotificationBanner = false;

  return (
    <div className={styles.chatHome}>
      <Header />
      {showNotificationBanner && isChatNotificationDisabled && <NotificationsDisabledBanner />}
      <Tabs
        variant="pill"
        value={activeTab}
        onChange={setActiveTab}
        tabs={tabs}
        className={styles.chatHome__tabs}
        tabListClassName={styles.chatHome__tabList}
      />
    </div>
  );
}
