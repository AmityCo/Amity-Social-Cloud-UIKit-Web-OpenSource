import { AmityEventResponseStatus } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { resolveString } from '~/v4/core/localization';
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
        content: resolveString(
          'amity_social_failed_to_update_your_attending_status_please_try_again',
        ),
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
          content: resolveString('amity_social_toast_snackbar_attending_status_updated'),
        });
      }
    },
    onError: (error) => {
      if (error.message.includes('Cannot update RSVP for live events')) {
        info({
          content: resolveString('amity_social_your_attending_status_cannot_be_changed_once_the_e'),
        });
      } else {
        info({
          content: resolveString(
            'amity_social_failed_to_update_your_attending_status_please_try_again',
          ),
        });
      }
    },
  });

  const getMyRSVP = async () => {
    return await event.getMyRSVP();
  };

  return { createRSVP, updateRSVP, getMyRSVP };
};
