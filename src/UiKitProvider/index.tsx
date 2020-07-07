import React, { useContext, useMemo } from 'react';
import { ThemeProvider } from 'styled-components';
import { CustomComponentsContext, CustomComponentsProvider } from '../hoks/customization';
import { IntlProvider } from 'react-intl';

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
    <IntlProvider locale="en-us">
      <ThemeProvider theme={theme}>
        <CustomComponentsProvider value={customComponents}>{children}</CustomComponentsProvider>
      </ThemeProvider>
    </IntlProvider>
  );
};

export default UiKitProvider;
