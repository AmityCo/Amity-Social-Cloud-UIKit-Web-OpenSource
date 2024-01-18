import React from 'react';
import PageHeader from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only/Header',
};

export const UiPageHeader = {
  render: () => {
    const [{ onBack, showBackButton, ...props }] = useArgs();
    const handleBack = showBackButton ? () => onBack() : null;
    return <PageHeader {...props} onBack={handleBack} />;
  },

  name: 'Page header',

  args: {
    title: 'Example page title',
    avatarFileUrl: 'https://cataas.com/cat',
    backLinkText: 'Back',
    showBackButton: false,
    hideBackArrow: false,
  },

  argTypes: {
    onBack: { action: 'onBack()' },
  },
};
