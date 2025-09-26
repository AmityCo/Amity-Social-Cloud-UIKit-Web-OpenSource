import React, { createContext, ReactNode, useContext, useState } from 'react';

interface DrawerData {
  content: ReactNode;
}

interface DrawerContextProps {
  drawerData?: DrawerData | null;
  setDrawerData: (data: DrawerData) => void;
  removeDrawerData: () => void;
}

export const DrawerContext = createContext<DrawerContextProps>({
  drawerData: null,
  setDrawerData: () => {},
  removeDrawerData: () => {},
});

export const DrawerProvider: React.FC = ({ children }) => {
  const [drawerData, setDrawerData] = useState<DrawerData | null>(null);

  return (
    <DrawerContext.Provider
      value={{
        drawerData,
        setDrawerData: (data: DrawerData) => {
          setDrawerData(data);
        },
        removeDrawerData: () => {
          setDrawerData(null);
        },
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawerData = () => {
  const { drawerData } = useContext(DrawerContext);
  return drawerData;
};

export const useDrawer = () => {
  const { setDrawerData, removeDrawerData } = useContext(DrawerContext);
  return { setDrawerData, removeDrawerData };
};
