import { ReactionRepository } from '@amityco/ts-sdk';

import useLiveCollection from '~/core/hooks/useLiveCollection';

type UseReactionsCollectionParams = Parameters<typeof ReactionRepository.getReactions>[0];

export const useReactionsCollection = (params: UseReactionsCollectionParams) => {
  const { items, ...rest } = useLiveCollection({
    fetcher: ReactionRepository.getReactions,
    params,
    shouldCall: () => !!params.referenceId && !!params.referenceType,
  });

  return {
    reactions: items,
    ...rest,
  };
};
