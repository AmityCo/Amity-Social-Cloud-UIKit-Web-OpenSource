import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';

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
      okText: 'Discard',
      cancelText: 'Keep editing',
      title: 'Discard this post?',
      content: 'The post will be permanently discarded. It cannot be undone.',
    });
  }

  return { discardPostCreation };
}
