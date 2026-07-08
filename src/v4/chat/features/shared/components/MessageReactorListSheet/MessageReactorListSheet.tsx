import { useEffect, useMemo, useState } from 'react';
import type { ComponentType, SVGProps } from 'react';
import { useReactionsCollection } from '~/v4/core/hooks/collections';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { useMessageObject } from '~/v4/chat/hooks/objects';
import { useMessageReactionQuery } from '~/v4/chat/hooks/queries';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { Tabs } from '~/v4/core/components/Tabs/Tabs';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { Skeleton } from '~/v4/core/components/Skeleton/Skeleton';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';
import { Avatar } from '~/v4/chat/elements/Avatar';
import { abbreviateCount } from '~/v4/utils/abbreviateCount';
import { REACTION_ICON_MAP } from '~/v4/chat/utils/reactionIcons';
import FallbackReaction from '~/v4/icons/FallbackReaction';
import SmilePlus from '~/v4/icons/SmilePlus';
import { useString } from '~/v4/core/localization';
import styles from './MessageReactorListSheet.module.css';

type MessageReactorListSheetProps = {
  message: Amity.Message;
  onClose: () => void;
};

const ALL_TAB = 'all' as const;

export function MessageReactorListSheet({ message, onClose }: MessageReactorListSheetProps) {
  const { currentUserId } = useSDK();
  const { removeReaction } = useMessageReactionQuery();
  const allTabLabel = useString('amity_chat_tab_all');

  const { message: liveMessage } = useMessageObject({ messageId: message.messageId });
  const currentMessage = liveMessage ?? message;
  const isMessageDeleted = !!currentMessage.isDeleted;

  const reactionMap = (currentMessage.reactions as Record<string, number> | undefined) ?? {};
  const totalCount = isMessageDeleted ? 0 : currentMessage.reactionsCount ?? 0;
  const distinctNames = useMemo(() => {
    if (isMessageDeleted) return [];
    return Object.entries(reactionMap)
      .filter(([, count]) => count > 0)
      .sort((a, b) => (a[1] === b[1] ? a[0].localeCompare(b[0]) : b[1] - a[1]))
      .map(([name]) => name);
  }, [reactionMap, isMessageDeleted]);

  const [activeTab, setActiveTab] = useState<string>(
    distinctNames.length > 1 ? ALL_TAB : distinctNames[0] ?? ALL_TAB,
  );
  const [sentinelNode, setSentinelNode] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeTab === ALL_TAB) return;
    if (distinctNames.includes(activeTab)) return;
    setActiveTab(distinctNames.length > 1 ? ALL_TAB : distinctNames[0] ?? ALL_TAB);
  }, [activeTab, distinctNames]);

  const queryParams = {
    referenceType: 'message' as Amity.ReactableType,
    referenceId: message.messageId ?? '',
    limit: 25,
    ...(activeTab !== ALL_TAB ? { reactionName: activeTab } : {}),
  };

  const { reactions, isLoading, isLoadingFirstPage, hasMore, loadMore } =
    useReactionsCollection(queryParams);
  const reactors: Amity.Reactor[] = reactions ?? [];

  const myReactor = useMemo(() => {
    if (!currentUserId) return null;
    return reactors.find((r) => r.userId === currentUserId) ?? null;
  }, [reactors, currentUserId]);

  const others = useMemo(
    () => (myReactor ? reactors.filter((r) => r !== myReactor) : reactors),
    [reactors, myReactor],
  );

  useIntersectionObserver({
    node: sentinelNode,
    onIntersect: () => {
      if (hasMore && !isLoading && !isLoadingFirstPage) loadMore();
    },
  });

  async function handleOwnRowPress() {
    if (!myReactor || !message.messageId) return;
    onClose();
    await removeReaction({
      message,
      reactionName: myReactor.reactionName,
    });
  }

  function renderContent() {
    if (totalCount === 0) {
      return <EmptyState />;
    }
    return (
      <div className={styles.messageReactorListSheet__list} data-vaul-no-drag>
        {myReactor && <ReactorRow reactor={myReactor} isOwn onPress={handleOwnRowPress} />}
        {others.map((r, index) => (
          <ReactorRow key={`${r.userId ?? 'unknown'}-${index}`} reactor={r} />
        ))}
        {(isLoadingFirstPage || isLoading) && <SkeletonRows count={3} />}
        {hasMore && !isLoading && !isLoadingFirstPage ? (
          <div ref={setSentinelNode} aria-hidden="true" />
        ) : null}
      </div>
    );
  }

  const tabs = () => {
    const items: { value: string; label: React.ReactNode; content: () => React.ReactNode }[] = [];
    const showAllTab = distinctNames.length === 0 || distinctNames.length > 1;
    if (showAllTab) {
      items.push({
        value: ALL_TAB,
        label: `${allTabLabel} ${abbreviateCount(totalCount)}`,
        content: renderContent,
      });
    }
    for (const name of distinctNames) {
      const Icon: ComponentType<SVGProps<SVGSVGElement>> =
        REACTION_ICON_MAP[name] ?? FallbackReaction;
      items.push({
        value: name,
        label: (
          <span className={styles.messageReactorListSheet__tabLabel}>
            <Icon className={styles.messageReactorListSheet__tabIcon} />
            {abbreviateCount(reactionMap[name] ?? 0)}
          </span>
        ),
        content: renderContent,
      });
    }
    return items;
  };

  return (
    <div className={styles.messageReactorListSheet}>
      <Tabs
        variant="underlined"
        fullWidth={false}
        value={activeTab}
        onChange={(key) => setActiveTab(String(key))}
        tabs={tabs()}
        className={styles.messageReactorListSheet__tabs}
        tabListClassName={styles.messageReactorListSheet__tabList}
        tabPanelClassName={styles.messageReactorListSheet__tabPanel}
      />
    </div>
  );
}

type ReactorRowProps = {
  reactor: Amity.Reactor;
  isOwn?: boolean;
  onPress?: () => void;
};

function ReactorRow({ reactor, isOwn = false, onPress }: ReactorRowProps) {
  const tapToRemoveLabel = useString('amity_common_button_tap_to_remove_reaction');
  const Icon: ComponentType<SVGProps<SVGSVGElement>> =
    REACTION_ICON_MAP[reactor.reactionName] ?? FallbackReaction;
  return (
    <Button
      type="button"
      variant="default"
      className={styles.messageReactorListSheet__row}
      onPress={onPress ?? (() => {})}
      aria-label={isOwn ? tapToRemoveLabel : reactor.user?.displayName ?? ''}
    >
      {reactor.user && <Avatar.User user={reactor.user} size="sm" />}
      <div className={styles.messageReactorListSheet__rowText}>
        <Typography.BodyBold className={styles.messageReactorListSheet__rowTitle}>
          {reactor.user?.displayName ?? ''}
        </Typography.BodyBold>
        {isOwn ? (
          <Typography.Caption className={styles.messageReactorListSheet__rowCaption}>
            {tapToRemoveLabel}
          </Typography.Caption>
        ) : null}
      </div>
      <Icon className={styles.messageReactorListSheet__rowReactionIcon} />
    </Button>
  );
}

function EmptyState() {
  const title = useString('amity_common_button_no_reactions_yet');
  const description = useString('amity_common_label_be_first_to_react', 'message');
  return (
    <div className={styles.messageReactorListSheet__emptyState}>
      <SmilePlus className={styles.messageReactorListSheet__emptyStateIcon} />
      <div className={styles.messageReactorListSheet__emptyStateText}>
        <Typography.TitleBold className={styles.messageReactorListSheet__emptyStateTitle}>
          {title}
        </Typography.TitleBold>
        <Typography.Caption className={styles.messageReactorListSheet__emptyStateDescription}>
          {description}
        </Typography.Caption>
      </div>
    </div>
  );
}

function SkeletonRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={styles.messageReactorListSheet__row}>
          <Skeleton.Circle width="2.5rem" height="2.5rem" />
          <Skeleton.Line width="8.75rem" height="0.625rem" radius="0.75rem" />
        </Skeleton>
      ))}
    </>
  );
}
