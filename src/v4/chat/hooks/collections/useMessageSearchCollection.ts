import { MessageRepository } from '@amityco/ts-sdk';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';
import { LIST_PAGE_LIMIT, SEARCH_MIN_QUERY_LENGTH } from '~/v4/chat/constants';

type Params = Parameters<typeof MessageRepository.searchMessage>[0];

type UseMessageSearchCollectionParams = {
  query: string;
};

export default function useMessageSearchCollection({ query }: UseMessageSearchCollectionParams) {
  const trimmed = query.trim();
  const shouldCall = trimmed.length >= SEARCH_MIN_QUERY_LENGTH;

  const params: Params = {
    query: trimmed,
    limit: LIST_PAGE_LIMIT,
  };

  const { items, ...rest } = useLiveCollectionV4<Amity.Message, Params>({
    fetcher: MessageRepository.searchMessage,
    params,
    shouldCall,
  });

  return {
    ...rest,
    messages: items,
  };
}
