import { MessageRepository } from '@amityco/ts-sdk';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { ERROR_RESPONSE } from '~/v4/chat/constants';

type CreateMessageParams = Parameters<typeof MessageRepository.createMessage>[0];
type CreateMessageResponse = Awaited<ReturnType<typeof MessageRepository.createMessage>>;

export const useCreateMessage: ({
  onSuccess,
  onError,
}?: {
  onSuccess?: () => void;
  onError?: (errorMsg: string) => void;
}) => {
  createMessage: UseMutationResult<
    CreateMessageResponse,
    Error,
    CreateMessageParams
  >['mutateAsync'];
  error: Error | null;
} = ({ onSuccess, onError } = {}) => {
  const { mutateAsync, error } = useMutation<CreateMessageResponse, Error, CreateMessageParams>({
    mutationFn: (params) => {
      return MessageRepository.createMessage(params);
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error) => {
      const { message } = error;
      let notificationMessage = "Your message wasn't sent. Please try again.";

      if (message.includes(ERROR_RESPONSE.CONTAIN_BLOCKED_WORD)) {
        notificationMessage = "Your message wasn't sent as it contains a blocked word.";
      } else if (message.includes(ERROR_RESPONSE.NOT_INCLUDE_WHITELIST_LINK)) {
        notificationMessage = 'Your message wasn’t sent as it contained a link that’s not allowed.';
      } else if (message.includes(ERROR_RESPONSE.USER_MUTED)) {
        notificationMessage = 'User is muted';
      }

      onError?.(notificationMessage);
    },
  });

  return {
    createMessage: mutateAsync,
    error,
  };
};
