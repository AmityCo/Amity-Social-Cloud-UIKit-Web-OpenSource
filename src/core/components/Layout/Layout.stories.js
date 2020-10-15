import React from 'react';
import SideNavBar from '~/core/components/SideNavBar';
import Layout from '.';

export default {
  title: 'Layout',
};

export const Headers = () => {
  return <Layout />;
};

export const SideNav = () => {
  return <SideNavBar />;
};

export const TestLayout = () => {
  return (
    <div>
      <Layout />
      <SideNavBar />
    </div>
  );
};
