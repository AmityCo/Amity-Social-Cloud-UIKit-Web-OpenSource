import { ReactionRepository } from '@amityco/ts-sdk';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';

type Params = Parameters<typeof ReactionRepository.getReactions>[0];

export function useReactionsCollection(params: Params) {
  const { items, ...rest } = useLiveCollectionV4<Amity.Reactor, Params>({
    fetcher: ReactionRepository.getReactions,
    params,
    shouldCall: !!params.referenceId && !!params.referenceType,
  });

  return {
    reactions: items,
    ...rest,
  };
}
