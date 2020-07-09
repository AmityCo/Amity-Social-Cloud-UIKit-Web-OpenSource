import React, { useContext, useMemo } from 'react';
import { ThemeProvider } from 'styled-components';
import { CustomComponentsContext, CustomComponentsProvider } from '../hoks/customization';
import { SdkProvider } from '../hoks/withSdk';
import { IntlProvider } from 'react-intl';
import GlobalStyle from './GlobalStyle';

const UiKitProvider = ({
  customComponents = {},
  theme = {},
  client,
  children /* TODO localization */,
}) => {
  const customComponentsMap = useContext(CustomComponentsContext);

  const memoizedCustomComponentsMap = useMemo(
    () => ({
      ...customComponentsMap,
      ...customComponents,
    }),
    [customComponentsMap, customComponents],
  );

  const sdkInfo = useMemo(
    () => ({
      client,
    }),
    [client],
  );

  return (
    <IntlProvider locale="en-us">
      <ThemeProvider theme={theme}>
        <SdkProvider value={sdkInfo}>
          <CustomComponentsProvider value={customComponents}>
            <GlobalStyle />
            {children}
          </CustomComponentsProvider>
        </SdkProvider>
      </ThemeProvider>
    </IntlProvider>
  );
};

export default UiKitProvider;
