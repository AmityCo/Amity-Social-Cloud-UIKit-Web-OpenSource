import useSDK from '~/v4/core/hooks/useSDK';
import { useQuery } from '@tanstack/react-query';

const STALE_TIME_5_SEC = 5 * 1000;

interface ProductCatalogueSettingsResult {
  productCatalogueSettings: Amity.ProductCatalogueSetting | null | undefined;
  isLoading: boolean;
  error: Error | null;
  refetchProductCatalogueSettings: () => Promise<Amity.ProductCatalogueSetting | null | undefined>;
}

export default function useProductCatalogueSettings(): ProductCatalogueSettingsResult {
  const { client } = useSDK();

  const {
    error,
    isLoading,
    data: productCatalogueSettings,
    refetch: refetchQuery,
  } = useQuery({
    queryKey: ['asc-uikit', 'ProductCatalogueSettings'],
    queryFn: async (): Promise<Amity.ProductCatalogueSetting | null> => {
      const settings = await client?.getProductCatalogueSetting();
      return settings as Amity.ProductCatalogueSetting | null;
    },
    enabled: !!client,
    staleTime: STALE_TIME_5_SEC,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const refetchProductCatalogueSettings = async () => {
    const result = await refetchQuery();
    return result.data;
  };

  return { productCatalogueSettings, isLoading, error, refetchProductCatalogueSettings };
}
