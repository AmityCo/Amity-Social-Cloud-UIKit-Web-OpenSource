import React from 'react';
import PageHeader from '.';

export default {
  title: 'Ui Only/Header',
};

export const UiPageHeader = ({ onBack, showBackButton, ...props }) => {
  const handleBack = showBackButton ? () => onBack() : null;
  return <PageHeader {...props} onBack={handleBack} />;
};

UiPageHeader.storyName = 'Page header';

UiPageHeader.args = {
  title: 'Example page title',
  avatarFileUrl: 'https://cataas.com/cat',
  backLinkText: 'Back',
  showBackButton: false,
  hideBackArrow: false,
};

UiPageHeader.argTypes = {
  onBack: { action: 'onBack()' },
};
