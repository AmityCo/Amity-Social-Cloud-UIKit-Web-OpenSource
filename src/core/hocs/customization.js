import React, { useContext, useMemo } from 'react';

export const CustomComponentsContext = React.createContext({});
export const CustomComponentsProvider = CustomComponentsContext.Provider;

/*
  This hoc allow as to customize components by it name

  usage:
  1) wrap component
  const MyCustomizableComponent = customizableComponent('ComponentName', Component);

  2) on customizable parent we can provide customization map with this component name what lead to rendering of new component instead of old one
  <Parent customComponents={ ComponentName: NewCustomComponent } />


  
  1) provide customization map to children components
  2) replace itself if it name in customizable map
 */

const customizableComponent = (componentName, Component) => props => {
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

  // TODO do not render provider if there is no changes(customComponents)
  return (
    <CustomComponentsProvider value={memoizedCustomComponentsMap}>
      {CustomComponent ? <CustomComponent {...props} /> : <Component {...props} />}
    </CustomComponentsProvider>
  );
};

export default customizableComponent;
