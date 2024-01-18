import { MessageRepository } from '@amityco/ts-sdk';

import useLiveCollection from '~/core/hooks/useLiveCollection';

export default function useMessagesCollection(channelId: string) {
  const { items, ...rest } = useLiveCollection({
    fetcher: MessageRepository.getMessages,
    params: {
      subChannelId: channelId,
      sortBy: 'segmentDesc',
    },
    shouldCall: () => !!channelId,
  });

  return {
    messages: items,
    ...rest,
  };
}
