import React, { useContext, useMemo } from 'react';

const CustomComponentsContext = React.createContext({});
export const CustomComponentsProvider = CustomComponentsContext.Provider;

export const customizableComponent = componentName => Component => props => {
  const CustomComponent = useContext(CustomComponentsContext)[componentName];
  return CustomComponent ? <CustomComponent {...props} /> : <Component {...props} />;
};

export const withCustomization = Component => props => {
  const { customComponents } = props;
  const customComponentsMap = useContext(CustomComponentsContext);

  const memoizedCustomComponentsMap = useMemo(
    () => ({ ...customComponentsMap, ...customComponents }),
    [customComponentsMap, customComponents],
  );

  return (
    <CustomComponentsProvider value={memoizedCustomComponentsMap}>
      <Component {...props} />
    </CustomComponentsProvider>
  );
};
