import React from 'react';
import { VisitorUsageLimitPage } from './VisitorUsageLimitPage';

export default {
  title: 'v4-social/pages/VisitorUsageLimitPage',
};

export const Default = {
  render: () => <VisitorUsageLimitPage onSignIn={() => alert('Sign in clicked')} />,
};
