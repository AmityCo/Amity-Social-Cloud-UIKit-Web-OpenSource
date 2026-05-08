import { MessageRepository } from '@amityco/ts-sdk';
import { resolveString } from '~/v4/core/localization';
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
      let notificationMessage = resolveString('amity_common_label_message_not_sent');

      if (message.includes(ERROR_RESPONSE.CONTAIN_BLOCKED_WORD)) {
        notificationMessage = resolveString('amity_social_label_msg_blocked_word');
      } else if (message.includes(ERROR_RESPONSE.NOT_INCLUDE_WHITELIST_LINK)) {
        notificationMessage = resolveString('amity_social_label_msg_link_not_allowed');
      } else if (message.includes(ERROR_RESPONSE.USER_MUTED)) {
        notificationMessage = resolveString('amity_social_button_user_muted');
      }

      onError?.(notificationMessage);
    },
  });

  return {
    createMessage: mutateAsync,
    error,
  };
};
