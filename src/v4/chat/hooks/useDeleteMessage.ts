import { MessageRepository } from '@amityco/ts-sdk';
import { useMutation, UseMutationResult } from '@tanstack/react-query';

// Extract parameter and response types
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
  const { mutateAsync } = useMutation<DeleteMessageResponse, Error, DeleteMessageParams>({
    mutationFn: (params) => {
      return MessageRepository.deleteMessage(params);
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error) => {
      const { message } = error;
      const errorMessage = 'Failed to delete message. Please try again.';

      console.error(message);
      onError?.(errorMessage);
    },
  });

  return {
    deleteMessage: mutateAsync,
  };
};
