import React, { useEffect } from "react";
import Layout from "./index";
import SideMenu from "../SideMenu";

export default {
  title: "Layout",
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
