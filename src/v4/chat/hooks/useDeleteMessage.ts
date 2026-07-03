import { MessageRepository } from '@amityco/ts-sdk';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useString } from '~/v4/core/localization/useString';

type DeleteMessageParams = Parameters<typeof MessageRepository.deleteMessage>[0];

type DeleteMessageResponse = Awaited<ReturnType<typeof MessageRepository.deleteMessage>>;

type UseDeleteMessageReturn = {
  deleteMessage: UseMutationResult<
    DeleteMessageResponse,
    Error,
    DeleteMessageParams
  >['mutateAsync'];
};

export const useDeleteMessage: ({
  onSuccess,
  onError,
}?: {
  onSuccess?: () => void;
  onError?: (errorMsg: string) => void;
}) => UseDeleteMessageReturn = ({ onSuccess, onError } = {}) => {
  const deleteErrorToast = useString('amity_chat_toast_delete_error');
  const { mutateAsync } = useMutation<DeleteMessageResponse, Error, DeleteMessageParams>({
    mutationFn: (params) => {
      return MessageRepository.deleteMessage(params);
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error) => {
      const { message } = error;
      onError?.(deleteErrorToast);
    },
  });

  return {
    deleteMessage: mutateAsync,
  };
};
