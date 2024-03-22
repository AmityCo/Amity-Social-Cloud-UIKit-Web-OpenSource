import React from 'react';
import { useNavigation } from '~/social/providers/NavigationProvider';

interface NavigationBehavior {
  closeAction(): void;
}

interface PageBehavior {
  navigationBehavior: NavigationBehavior;
}

const PageBehaviorContext = React.createContext<PageBehavior | undefined>(undefined);

interface PageBehaviorProviderProps {
  children: React.ReactNode;
  customNavigationBehavior?: Partial<NavigationBehavior>;
}

export const PageBehaviorProvider: React.FC<PageBehaviorProviderProps> = ({
  children,
  customNavigationBehavior = {},
}) => {
  const { onBack } = useNavigation();
  const defaultNavigationBehavior: NavigationBehavior = {
    closeAction: () => {
      onBack();
    },
  };
  const mergedNavigationBehavior: NavigationBehavior = {
    ...defaultNavigationBehavior,
    ...customNavigationBehavior,
  };

  const pageBehavior: PageBehavior = {
    navigationBehavior: mergedNavigationBehavior,
  };

  return (
    <PageBehaviorContext.Provider value={pageBehavior}>{children}</PageBehaviorContext.Provider>
  );
};

export const usePageBehavior = () => {
  const pageBehavior = React.useContext(PageBehaviorContext);
  if (!pageBehavior) {
    throw new Error('usePageBehavior must be used within a PageBehaviorProvider');
  }
  return pageBehavior;
};
