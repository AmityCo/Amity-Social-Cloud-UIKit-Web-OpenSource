import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { resolveString } from '~/v4/core/localization';

type UseDiscardPostCreation = {
  pageId?: string;
  onDiscard: () => void;
};

export function useDiscardPostCreation() {
  const { confirm } = useConfirmContext();

  function discardPostCreation({ pageId = '*', onDiscard }: UseDiscardPostCreation) {
    confirm({
      pageId,
      onOk: onDiscard,
      type: 'confirm',
      okText: resolveString('amity_social_modal_dialog_discard_button'),
      cancelText: resolveString('amity_social_button_keep_editing'),
      title: resolveString('amity_social_modal_dialog_title_discard_post'),
      content: resolveString('amity_social_modal_dialog_discard_post'),
    });
  }

  return { discardPostCreation };
}
