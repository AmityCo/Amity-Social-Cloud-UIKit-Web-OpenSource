import { MessageRepository } from '@amityco/ts-sdk';

import useLiveCollection from '~/core/hooks/useLiveCollection';

export default function useMessagesCollection(
  params: Parameters<typeof MessageRepository.getMessages>[0],
) {
  const { items, ...rest } = useLiveCollection({
    fetcher: MessageRepository.getMessages,
    params: params,
    shouldCall: () => !!params.subChannelId,
  });

  return {
    messages: items,
    ...rest,
  };
}
