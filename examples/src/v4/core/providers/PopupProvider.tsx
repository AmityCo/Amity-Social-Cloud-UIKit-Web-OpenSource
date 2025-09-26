import React, { createContext, PropsWithChildren, useCallback, useContext, useState } from 'react';
import { ModalOverlayProps } from 'react-aria-components';
import { uniqueId } from '~/v4/utils/uniqueId';

type PopupContent = Omit<ModalOverlayProps, 'children'> & {
  id?: string;
  pageId?: string;
  componentId?: string;
  keepPrevious?: boolean;
  header?: React.ReactNode;
  overlayClassName?: string;
  disabledAnimation?: boolean;
  view?: 'desktop' | 'mobile' | 'all' | 'none';
  onClose?: ({ close }: { close: () => void }) => void;
  children: React.ReactNode | (({ close }: { close: () => void }) => React.ReactNode);
};

type PopupContextProps = {
  popups: PopupContent[];
  closePopup: (id?: string) => void;
  openPopup: (popup: PopupContent) => void;
};

const PopupContext = createContext<PopupContextProps>({
  popups: [],
  closePopup: (id?: string) => {},
  openPopup: (popup: PopupContent) => {},
});

export const usePopupContext = () => {
  const context = useContext(PopupContext);
  if (!context) throw new Error('usePopupContext must be used within a LayoutProvider');
  return context;
};

type PopupProviderProps = PropsWithChildren<unknown>;

export const PopupProvider: React.FC<PopupProviderProps> = ({ children }) => {
  const [popups, setPopups] = useState<PopupContent[]>([]);

  const openPopup = useCallback((popup: PopupContent) => {
    setPopups((popups) => [...popups, { id: uniqueId('popup'), ...popup }]);
  }, []);

  const closePopup = useCallback((popupId?: string) => {
    setPopups((popups) => (!popupId ? [] : popups.filter((popup) => popup.id !== popupId)));
  }, []);

  return (
    <PopupContext.Provider value={{ popups, openPopup, closePopup }}>
      {children}
    </PopupContext.Provider>
  );
};
