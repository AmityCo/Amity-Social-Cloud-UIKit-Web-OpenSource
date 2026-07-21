import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { Menu } from '~/v4/core/design/components/Menu';
import { useDeleteMessageQuery, useResendMessageQuery } from '~/v4/chat/hooks/queries';
import { useString } from '~/v4/core/localization';
import { isSyntheticPendingMessage } from './useMessageComposer';

type UseFailedMessageSheetParams = {
  onRetryUpload: (clientId: string) => void;
  onDiscardUpload: (clientId: string) => void;
  onRetryText: (clientId: string) => void;
  onDiscardText: (clientId: string) => void;
};

export type UseFailedMessageSheetReturn = {
  openFailedSheet: (message: Amity.Message) => void;
};

export function useFailedMessageSheet({
  onRetryUpload,
  onDiscardUpload,
  onRetryText,
  onDiscardText,
}: UseFailedMessageSheetParams): UseFailedMessageSheetReturn {
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { requestDelete } = useDeleteMessageQuery();
  const { requestResend } = useResendMessageQuery();
  const resendLabel = useString('amity_chat_message_resend');
  const deleteLabel = useString('amity_chat_option_delete');

  async function handleResend(message: Amity.Message) {
    removeDrawerData();
    if (isSyntheticPendingMessage(message)) {
      if (message.dataType === 'text') {
        onRetryText(message.__syntheticClientId);
      } else {
        onRetryUpload(message.__syntheticClientId);
      }
      return;
    }
    await requestResend(message);
  }

  function handleDelete(message: Amity.Message) {
    removeDrawerData();
    if (isSyntheticPendingMessage(message)) {
      if (message.dataType === 'text') {
        onDiscardText(message.__syntheticClientId);
      } else {
        onDiscardUpload(message.__syntheticClientId);
      }
      return;
    }
    requestDelete(message);
  }

  function openFailedSheet(message: Amity.Message) {
    setDrawerData({
      ariaLabel: 'Message actions',
      content: (
        <Menu container="drawer">
          <Menu.Item label={resendLabel} onPress={() => handleResend(message)} />
          <Menu.Item label={deleteLabel} destructive onPress={() => handleDelete(message)} />
        </Menu>
      ),
    });
  }

  return { openFailedSheet };
}
