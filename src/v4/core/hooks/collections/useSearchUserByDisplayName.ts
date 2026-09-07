import { SearchUsersByEnum, UserRepository } from '@amityco/ts-sdk';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';

type Params = Parameters<typeof UserRepository.searchUsers>[0];

type UseSearchUserByDisplayNameOptions = {
  shouldCall?: boolean;
};

export function useSearchUserByDisplayName(
  params: Params,
  { shouldCall = true }: UseSearchUserByDisplayNameOptions = {},
) {
  const { items, ...rest } = useLiveCollectionV4<Amity.User, Params>({
    fetcher: UserRepository.searchUsers,
    params: { ...params, searchBy: [SearchUsersByEnum.DISPLAY_NAME] },
    shouldCall,
  });

  return {
    users: items,
    ...rest,
  };
}
