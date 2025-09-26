import React from 'react';
import { FormattedMessage } from 'react-intl';
import { notification } from '~/v4/core/components/Notification';

export const copyMessage = (message: string) => {
  navigator.clipboard.writeText(message).then(() => {
    notification.show({
      content: <FormattedMessage id="livechat.notification.copy.message" />,
    });
  });
};
