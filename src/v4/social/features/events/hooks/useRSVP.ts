import { AmityEventResponseStatus } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

export const useRSVP = (event: Amity.Event) => {
  const { success, error } = useNotifications();

  const { mutateAsync: createRSVP } = useMutation({
    mutationFn: async (status: AmityEventResponseStatus) => {
      return await event.createRSVP(status);
    },

    onError: () => {
      error({
        content: 'Failed to update your attending status. Please try again.',
      });
    },
  });

  const { mutateAsync: updateRSVP } = useMutation({
    mutationFn: async (status: AmityEventResponseStatus) => {
      return await event.updateRSVP(status);
    },
    onSuccess: (response) => {
      if (response?.status === AmityEventResponseStatus.NotGoing) {
        success({
          content: 'Successfully updated your attending status.',
        });
        return;
      }
    },
    onError: () => {
      error({
        content: 'Failed to update your attending status. Please try again.',
      });
    },
  });

  const getMyRSVP = async () => {
    return await event.getMyRSVP();
  };

  return { createRSVP, updateRSVP, getMyRSVP };
};
