import React from 'react';
import { ThemeProvider } from 'styled-components';
import { CustomComponentsProvider, withCustomization } from '../hoks/customization';

const UiKitProvider = ({ customComponents, theme, children /* TODO localization */ }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

export default withCustomization(UiKitProvider);
