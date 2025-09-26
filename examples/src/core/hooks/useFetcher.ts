import { useEffect, useState } from 'react';

import { useSDKFetcherConnector } from '../providers/SDKConnectorProvider';

function useFetcher<TArgs, TResponse>({
  fetchFn,
  params,
  shouldCall = () => true,
}: {
  fetchFn: (...args: TArgs[]) => Promise<TResponse>;
  params: TArgs[];
  shouldCall?: () => boolean;
}) {
  const [item, setItem] = useState<TResponse | null>(null);
  const { fetch } = useSDKFetcherConnector();

  useEffect(() => {
    function run() {
      if (!shouldCall()) return;
      fetch({
        fetchFn,
        params,
      }).then((response) => {
        setItem(response);
      });
    }
    run();
  }, [params]);

  return item;
}

export default useFetcher;
