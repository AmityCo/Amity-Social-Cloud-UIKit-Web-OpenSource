import { useState, useMemo } from 'react';
import { SEARCH_PRODUCT_MINIMUM_CHARACTER } from '~/social/constants';
import { useSearchProducts } from '~/v4/social/features/product-tagged/hooks';

export interface ProductSuggestionData {
  productId: string;
  displayName?: string;
  product?: Amity.Product;
}

export const useProductSuggestions = (enabled: boolean = true) => {
  const [queryString, setQueryString] = useState<string | null>(null);

  const {
    items: products,
    hasMore,
    loadMore,
    isLoading,
  } = useSearchProducts({
    keyword: queryString || '',
    isActive: true,
    isDeleted: false,
    limit: 10,
    shouldCall: enabled,
    minKeywordLength: SEARCH_PRODUCT_MINIMUM_CHARACTER,
  });

  const onQueryChange = (newQuery: string | null) => {
    setQueryString(newQuery);
  };

  const suggestions = useMemo<ProductSuggestionData[]>(() => {
    return products.map((product) => ({
      productId: product.productId,
      displayName: product.productName,
      product,
    }));
  }, [products]);

  return {
    suggestions,
    queryString,
    onQueryChange,
    loadMore,
    hasMore,
    isLoading,
  };
};
