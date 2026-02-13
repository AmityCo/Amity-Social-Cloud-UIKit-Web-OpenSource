import useSDK from '~/v4/core/hooks/useSDK';
import { useQuery } from '@tanstack/react-query';

const STALE_TIME_5_MINUTES = 5 * 60 * 1000;

export default function useProductCatalogueSettings() {
  const { client } = useSDK();

  const {
    error,
    isLoading,
    data: productCatalogueSettings,
  } = useQuery({
    queryKey: ['asc-uikit', 'ProductCatalogueSettings'],
    queryFn: async (): Promise<Amity.ProductCatalogueSetting | null> => {
      const settings = await client?.getProductCatalogueSetting();
      return settings as Amity.ProductCatalogueSetting | null;
    },
    enabled: !!client,
    staleTime: STALE_TIME_5_MINUTES,
  });

  return { productCatalogueSettings, isLoading, error };
}
