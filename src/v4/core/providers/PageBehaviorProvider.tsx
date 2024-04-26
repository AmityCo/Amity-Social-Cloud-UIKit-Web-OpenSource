import React, { useMemo, useContext } from 'react';
import { useNavigation } from '~/social/providers/NavigationProvider';

interface NavigationBehavior {
  onCloseAction(): void;
  onClickHyperLink(): void;
}

interface PageBehavior {
  navigationBehavior: NavigationBehavior;
}

const PageBehaviorContext = React.createContext<PageBehavior | undefined>(undefined);

interface PageBehaviorProviderProps {
  children: React.ReactNode;
  pageBehavior?: Partial<NavigationBehavior>;
}

export const PageBehaviorProvider: React.FC<PageBehaviorProviderProps> = ({
  children,
  pageBehavior = {},
}) => {
  const { onBack } = useNavigation();
  const defaultNavigationBehavior: NavigationBehavior = {
    onCloseAction: () => {
      onBack();
    },
    onClickHyperLink: () => {},
  };

  const pageBehaviorMemo = useMemo(() => {
    const mergedNavigationBehavior: NavigationBehavior = {
      ...defaultNavigationBehavior,
      ...pageBehavior,
    };
    return {
      navigationBehavior: mergedNavigationBehavior,
    };
  }, []);

  return (
    <PageBehaviorContext.Provider value={pageBehaviorMemo}>{children}</PageBehaviorContext.Provider>
  );
};

export const usePageBehavior = () => {
  const pageBehavior = useContext(PageBehaviorContext);
  if (!pageBehavior) {
    throw new Error('usePageBehavior must be used within a PageBehaviorProvider');
  }
  return pageBehavior;
};
