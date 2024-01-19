import React, { ReactNode } from 'react';

import { IntlProvider } from 'react-intl';
import i18n from '~/i18n';

const defaultLocale = 'en';

const Localization = ({ locale, children }: { locale: keyof typeof i18n; children: ReactNode }) => {
  const messages = i18n[locale] ? i18n[locale] : i18n[defaultLocale];

  return (
    <IntlProvider defaultLocale={defaultLocale} locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
};

export default Localization;
