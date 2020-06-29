import React, { useContext } from 'react';

const CustomComponentsContext = React.createContext({});
export const CustomComponentsProvider = CustomComponentsContext.Provider;

export const customizableComponent = componentName => Component => props => {
  const CustomComponent = useContext(CustomComponentsContext)[componentName];
  return CustomComponent ? <CustomComponent {...props} /> : <Component {...props} />;
};

export const withCustomization = Component => props => {
  const { customComponents } = props;
  const customComponentsMap = useContext(CustomComponentsContext);
  return (
    <CustomComponentsProvider value={{ ...customComponentsMap, ...customComponents }}>
      <Component {...props} />
    </CustomComponentsProvider>
  );
};
