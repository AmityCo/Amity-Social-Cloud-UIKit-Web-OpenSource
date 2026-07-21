import type { RefObject } from 'react';
import { Popover, Dialog } from 'react-aria-components';
import { Menu, type MenuIcon } from '~/v4/core/design/components/Menu';
import { resolveString } from '~/v4/core/localization';
import { useFlagMessageQuery, useMessageReactionQuery } from '~/v4/chat/hooks/queries';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { ReactionPicker } from '~/v4/chat/elements/ReactionPicker';
import { Pen } from '~/v4/core/design/icons/Pen';
import { ShareLeft } from '~/v4/core/design/icons/ShareLeft';
import { Copy } from '~/v4/core/design/icons/Copy';
import { ArrowDownToBracket } from '~/v4/core/design/icons/ArrowDownToBracket';
import { Trash } from '~/v4/core/design/icons/Trash';
import { Flag } from '~/v4/core/design/icons/Flag';
import styles from './MessageActionsPopover.module.css';
import { TypographyVariant } from '~/v4/core/components';

export type MessageActionItem = {
  key: string;
  icon: MenuIcon;
  label: string;
  destructive?: boolean;
  loading?: boolean;
  onPress: () => void;
};

type BubbleMenuHandlers = {
  onEdit: () => void;
  onReply: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onSave: () => void;
  onReport: (message: Amity.Message) => void;
  onUnreport: () => void;
};

type BubbleMenuFlagState = {
  isLoading: boolean;
  isFlaggedByMe: boolean;
};

type MessageActionsPopoverProps = {
  anchor: HTMLElement;
  message: Amity.Message;
  handlers: Omit<BubbleMenuHandlers, 'onUnreport'>;
  onDismiss: () => void;
  viewerIsMutedInChannel?: boolean;
};

const MUTED_VICTIM_TRIMMED_KEYS = new Set([
  'edit',
  'reply',
  'report',
  'unreport',
  'report-loading',
]);

export function buildBubbleMenuItems(
  message: Amity.Message,
  currentUserId: string | null | undefined,
  flagState: BubbleMenuFlagState,
  handlers: BubbleMenuHandlers,
  viewerIsMutedInChannel: boolean = false,
): MessageActionItem[] {
  const isOwn = !!currentUserId && message.creatorId === currentUserId;
  const isText = message.dataType === 'text';
  const isCustom = message.dataType === 'custom';
  const isImage = message.dataType === 'image';
  const isVideo = message.dataType === 'video';
  const isSynced = message.syncState === ('synced' as Amity.SyncState);
  const isDeleted = message.isDeleted === true;
  const isActive = isSynced && !isDeleted;

  const items: (MessageActionItem & { visible: boolean })[] = [
    {
      key: 'edit',
      icon: <Pen />,
      label: resolveString('amity_chat_option_edit'),
      onPress: handlers.onEdit,
      visible: isOwn && isText && isActive,
    },
    {
      key: 'reply',
      icon: <ShareLeft />,
      label: resolveString('amity_chat_option_reply'),
      onPress: handlers.onReply,
      visible: isActive,
    },
    {
      key: 'copy',
      icon: <Copy />,
      label: resolveString('amity_chat_option_copy'),
      onPress: handlers.onCopy,
      visible: (isText || isCustom) && isActive,
    },
    {
      key: 'save',
      icon: <ArrowDownToBracket />,
      label: resolveString('amity_chat_action_save'),
      onPress: handlers.onSave,
      visible: (isImage || isVideo) && isActive,
    },
    {
      key: 'report-loading',
      icon: Flag,
      label: '',
      loading: true,
      onPress: () => {},
      visible: !isOwn && flagState.isLoading,
    },
    {
      key: 'unreport',
      icon: <Flag />,
      label: resolveString('amity_chat_option_unreport'),
      onPress: handlers.onUnreport,
      visible: !isOwn && !flagState.isLoading && flagState.isFlaggedByMe,
    },
    {
      key: 'report',
      icon: Flag,
      label: resolveString('amity_chat_option_report'),
      onPress: () => handlers.onReport(message),
      visible: !isOwn && !flagState.isLoading && !flagState.isFlaggedByMe,
    },
    {
      key: 'delete',
      icon: 'trash',
      label: resolveString('amity_chat_option_delete'),
      destructive: true,
      onPress: handlers.onDelete,
      visible: isOwn,
    },
  ];

  const visibleItems = items.filter((item) => item.visible);
  if (!viewerIsMutedInChannel) return visibleItems;
  return visibleItems.filter((item) => !MUTED_VICTIM_TRIMMED_KEYS.has(item.key));
}

export function MessageActionsPopover({
  anchor,
  message,
  handlers,
  onDismiss,
  viewerIsMutedInChannel = false,
}: MessageActionsPopoverProps) {
  const triggerRef = { current: anchor } as RefObject<HTMLElement>;
  const { currentUserId } = useSDK();
  const isOwn = !!currentUserId && message.creatorId === currentUserId;

  const { isLoading, isFlaggedByMe, unreport } = useFlagMessageQuery({
    messageId: message.messageId,
    enabled: !isOwn,
  });

  const { selectReaction } = useMessageReactionQuery();
  const myReaction = message.myReactions?.[0] ?? null;

  const items = buildBubbleMenuItems(
    message,
    currentUserId,
    { isLoading, isFlaggedByMe },
    {
      ...handlers,
      onUnreport: () => unreport(),
    },
    viewerIsMutedInChannel,
  );

  if (items.length === 0) return null;

  return (
    <Popover
      isOpen
      triggerRef={triggerRef}
      onOpenChange={(open) => {
        if (!open) onDismiss();
      }}
      placement="bottom right"
    >
      <Dialog aria-label="Message actions" className={styles.messageActionsPopover}>
        <div className={styles.messageActionsPopover__reactionPicker}>
          <ReactionPicker
            myReaction={myReaction}
            position="above"
            onReactionClick={(reactionName) => {
              selectReaction({ message, reactionName });
              setTimeout(() => onDismiss(), 0);
            }}
          />
        </div>
        <div className={styles.messageActionsPopover__menu}>
          <Menu variant="chat">
            {items.map((item) => {
              if (item.loading) return <Menu.Item.Skeleton key={item.key} />;
              return (
                <Menu.Item
                  key={item.key}
                  icon={item.icon}
                  label={item.label}
                  destructive={item.destructive}
                  typography={TypographyVariant.Body}
                  onPress={() => {
                    item.onPress();
                    onDismiss();
                  }}
                />
              );
            })}
          </Menu>
        </div>
      </Dialog>
    </Popover>
  );
}
