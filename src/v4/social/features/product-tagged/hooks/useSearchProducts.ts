import { ProductRepository } from '@amityco/ts-sdk';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';

type UseSearchProductsParams = Partial<Parameters<typeof ProductRepository.searchProducts>[0]> & {
  minKeywordLength: number;
  shouldCall?: boolean;
};

export function useSearchProducts({
  shouldCall,
  limit = 20,
  minKeywordLength = 0,
  ...props
}: UseSearchProductsParams) {
  const hasMinKeywordLength = (props.keyword?.length ?? 0) >= minKeywordLength;

  const query = useLiveCollectionV4({
    params: { keyword: props.keyword ?? '', limit, ...props },
    fetcher: ProductRepository.searchProducts,
    shouldCall: shouldCall && hasMinKeywordLength,
  });

  return { ...query };
}
