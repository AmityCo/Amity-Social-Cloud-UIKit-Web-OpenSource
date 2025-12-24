import { AmityEventResponseStatus } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

export const useRSVP = ({ event }: { event: Amity.Event }) => {
  const { success, info } = useNotifications();

  const { mutateAsync: createRSVP } = useMutation({
    networkMode: 'always',
    mutationFn: async (status: AmityEventResponseStatus) => {
      return await event.createRSVP(status);
    },

    onError: () => {
      info({
        content: 'Failed to update your attending status. Please try again.',
      });
    },
  });

  const { mutateAsync: updateRSVP } = useMutation({
    networkMode: 'always',
    mutationFn: async (status: AmityEventResponseStatus) => {
      return await event.updateRSVP(status);
    },
    onSuccess: (response) => {
      if (response?.status === AmityEventResponseStatus.NotGoing) {
        success({
          content: 'Successfully updated your attending status.',
        });
      }
    },
    onError: (error) => {
      if (error.message.includes('Cannot update RSVP for live events')) {
        info({
          content: 'Your attending status cannot be changed once the event has started.',
        });
      } else {
        info({
          content: 'Failed to update your attending status. Please try again.',
        });
      }
    },
  });

  const getMyRSVP = async () => {
    return await event.getMyRSVP();
  };

  return { createRSVP, updateRSVP, getMyRSVP };
};
