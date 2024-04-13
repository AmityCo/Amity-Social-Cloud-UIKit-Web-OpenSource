import { MessageRepository } from '@amityco/ts-sdk';

import useLiveCollection from '~/core/hooks/useLiveCollection';

type UseMessagesCollectionParams = Parameters<typeof MessageRepository.getMessages>[0];

export default function useMessagesCollection(params: UseMessagesCollectionParams) {
  const { items, ...rest } = useLiveCollection({
    fetcher: MessageRepository.getMessages,
    params,
    shouldCall: () => !!params.subChannelId,
  });

  return {
    messages: items,
    ...rest,
  };
}
