import React, { useContext, useMemo } from 'react';
import { ThemeProvider } from 'styled-components';
import { CustomComponentsContext, CustomComponentsProvider } from '../hoks/customization';

const UiKitProvider = ({ customComponents, theme, children /* TODO localization */ }) => {
  const customComponentsMap = useContext(CustomComponentsContext);

  const memoizedCustomComponentsMap = useMemo(
    () => ({
      ...customComponentsMap,
      ...customComponents,
    }),
    [customComponentsMap, customComponents],
  );

  return (
    <ThemeProvider theme={theme}>
      <CustomComponentsProvider value={customComponents}>{children}</CustomComponentsProvider>
    </ThemeProvider>
  );
};

export default UiKitProvider;
