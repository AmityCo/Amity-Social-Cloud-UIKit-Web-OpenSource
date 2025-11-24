import { Key } from 'react-aria';
import { useState } from 'react';
import { Plus } from '~/v4/icons/Plus';
import useSDK from '~/v4/core/hooks/useSDK';
import { Tabs, Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import { MyEvents } from '~/v4/social/features/events/EventHub/components/MyEvents';
import { ExploreEvent } from '~/v4/social/features/events/EventHub/components/Explore';
import {
  useEventPermission,
  useRedirectEventTargetSelectionPage,
} from '~/v4/social/features/events/hooks';
import styles from './Events.module.css';

enum EventsTab {
  Explore = 'Explore',
  MyEvents = 'My Events',
}

type EventsProps = {
  pageId?: string;
};

export function Events({ pageId }: EventsProps) {
  const { isVisitorOrBot } = useSDK();
  const { hasCreateEventPermission } = useEventPermission();
  const [activeTab, setActiveTab] = useState<Key>(EventsTab.Explore);
  const { redirectEventTargetSelectionPage } = useRedirectEventTargetSelectionPage();

  return (
    <section className={styles.events}>
      <div className={styles.events__header} data-has-tabs={!isVisitorOrBot}>
        <Typography.Headline>Events</Typography.Headline>
        {hasCreateEventPermission && (
          <Button
            icon={<Plus />}
            variant="default"
            onPress={redirectEventTargetSelectionPage}
            iconClassName={styles.events__header__icon}
          />
        )}
      </div>
      {isVisitorOrBot ? (
        <ExploreEvent pageId={pageId} />
      ) : (
        <Tabs
          value={activeTab}
          variant="underlined"
          onChange={setActiveTab}
          tabs={[
            {
              value: EventsTab.Explore,
              label: 'Explore',
              content: () => <ExploreEvent pageId={pageId} />,
            },
            {
              value: EventsTab.MyEvents,
              label: 'My events',
              content: () => <MyEvents pageId={pageId} />,
            },
          ]}
        />
      )}
    </section>
  );
}
