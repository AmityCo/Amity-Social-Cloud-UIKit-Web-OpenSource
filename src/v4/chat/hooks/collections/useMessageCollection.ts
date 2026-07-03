import { MessageRepository } from '@amityco/ts-sdk';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';

type Params = Parameters<typeof MessageRepository.getMessages>[0];

export function useMessageCollection(params: Params) {
  const { items, ...rest } = useLiveCollectionV4<Amity.Message, Params>({
    fetcher: MessageRepository.getMessages,
    params,
    shouldCall: !!params.subChannelId,
  });

  return {
    ...rest,
    messages: items,
  };
}
