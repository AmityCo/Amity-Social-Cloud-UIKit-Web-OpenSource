import React from 'react';
import SideMenu from '~/core/components/SideMenu';
import Layout from '.';

export default {
  title: 'Layout',
};

export const headers = () => {
  return <Layout />;
};

export const sidemenu = () => {
  return <SideMenu />;
};

export const testlayout = () => {
  return (
    <div>
      <Layout />
      <SideMenu />
    </div>
  );
};
