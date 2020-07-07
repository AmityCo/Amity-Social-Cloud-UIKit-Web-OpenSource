import React, { useContext, useMemo } from 'react';

export const CustomComponentsContext = React.createContext({});
export const CustomComponentsProvider = CustomComponentsContext.Provider;

export const customizableComponent = componentName => Component => props => {
  const { customComponents } = props;

  const customComponentsMap = useContext(CustomComponentsContext);

  const CustomComponent = customComponentsMap[componentName];

  const memoizedCustomComponentsMap = useMemo(
    () => ({
      ...customComponentsMap,
      ...customComponents,
      [componentName]: null, // prevent recursive rendering in case if inside custom component nested original component
    }),
    [customComponentsMap, customComponents],
  );

  // TODO do not render provider if there is no changes
  return (
    <CustomComponentsProvider value={memoizedCustomComponentsMap}>
      {CustomComponent ? <CustomComponent {...props} /> : <Component {...props} />}
    </CustomComponentsProvider>
  );
};
