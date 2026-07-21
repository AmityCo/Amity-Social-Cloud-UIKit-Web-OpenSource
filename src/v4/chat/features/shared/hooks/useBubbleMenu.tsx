import { useState } from 'react';
import { useDeleteMessageQuery, useSaveMediaMessageQuery } from '~/v4/chat/hooks/queries';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { ContentReportReason } from '~/v4/core/design/components/ContentReportReason';
import { MessageReactorListSheet } from '~/v4/chat/features/shared/components/MessageReactorListSheet';
import { useString } from '~/v4/core/localization';
import { getClipboardPayload } from '~/v4/chat/utils/getClipboardPayload';

type BubbleMenuState = {
  message: Amity.Message;
  anchor: HTMLElement;
};

type UseBubbleMenuParams = {
  onEditMessage: (message: Amity.Message) => void;
  onReplyMessage: (message: Amity.Message) => void;
  viewerIsMutedInChannel?: boolean;
};

export type UseBubbleMenuReturn = {
  bubbleMenu: BubbleMenuState | null;
  openBubbleMenu: (message: Amity.Message, anchor: HTMLElement) => void;
  closeBubbleMenu: () => void;
  handleBubbleDelete: () => void;
  handleBubbleEdit: () => void;
  handleBubbleReply: () => void;
  handleBubbleCopy: () => Promise<void>;
  handleBubbleSave: () => void;
  handleBubbleReport: (message: Amity.Message) => void;
  handleOpenReactorListSheet: (message: Amity.Message) => void;
  viewerIsMutedInChannel: boolean;
};

export function useBubbleMenu({
  onEditMessage,
  onReplyMessage,
  viewerIsMutedInChannel = false,
}: UseBubbleMenuParams): UseBubbleMenuReturn {
  const { requestDelete } = useDeleteMessageQuery();
  const { requestSave } = useSaveMediaMessageQuery();
  const { success, error } = useNotifications('chat');
  const copiedToast = useString('amity_chat_toast_copied');
  const { openPopup, closePopup } = usePopupContext();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { isDesktop } = useResponsive();
  const [bubbleMenu, setBubbleMenu] = useState<BubbleMenuState | null>(null);

  function openBubbleMenu(message: Amity.Message, anchor: HTMLElement) {
    setBubbleMenu({ message, anchor });
  }

  function closeBubbleMenu() {
    setBubbleMenu(null);
  }

  function handleBubbleDelete() {
    if (!bubbleMenu) return;
    const message = bubbleMenu.message;
    closeBubbleMenu();
    requestDelete(message);
  }

  function handleBubbleEdit() {
    if (!bubbleMenu) return;
    const message = bubbleMenu.message;
    closeBubbleMenu();
    onEditMessage(message);
  }

  function handleBubbleReply() {
    if (!bubbleMenu) return;
    const message = bubbleMenu.message;
    closeBubbleMenu();
    onReplyMessage(message);
  }

  async function handleBubbleCopy() {
    if (!bubbleMenu) return;
    const message = bubbleMenu.message;
    closeBubbleMenu();

    const payload = getClipboardPayload(message);
    if (payload) {
      await navigator.clipboard.writeText(payload);
      success({ content: copiedToast, alignment: 'with-composer' });
    }
  }

  function handleBubbleSave() {
    if (!bubbleMenu) return;
    const message = bubbleMenu.message;
    closeBubbleMenu();
    requestSave(message);
  }

  function handleBubbleReport(message: Amity.Message) {
    if (isDesktop) {
      openPopup({
        id: 'message_report_reason',
        view: 'desktop',
        isDismissable: false,
        children: (
          <ContentReportReason
            onCloseMenu={closePopup}
            message={message}
            showReportPostButton={false}
          />
        ),
      });
      return;
    }

    setDrawerData({
      content: (
        <ContentReportReason
          onCloseMenu={removeDrawerData}
          message={message}
          showReportPostButton={false}
        />
      ),
    });
  }

  function handleOpenReactorListSheet(message: Amity.Message) {
    closeBubbleMenu();
    if (isDesktop) {
      openPopup({
        id: 'message_reactor_list',
        view: 'desktop',
        isDismissable: true,
        children: <MessageReactorListSheet messageId={message.messageId} onClose={closePopup} />,
      });
      return;
    }

    setDrawerData({
      snapPoints: [0.5, 1],
      ariaLabel: 'Reactions',
      content: <MessageReactorListSheet messageId={message.messageId} onClose={removeDrawerData} />,
    });
  }

  return {
    bubbleMenu,
    openBubbleMenu,
    closeBubbleMenu,
    handleBubbleDelete,
    handleBubbleEdit,
    handleBubbleReply,
    handleBubbleCopy,
    handleBubbleSave,
    handleBubbleReport,
    handleOpenReactorListSheet,
    viewerIsMutedInChannel,
  };
}
