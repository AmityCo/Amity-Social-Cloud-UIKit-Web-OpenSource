import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
  useEffect,
} from 'react';
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
  media?: boolean;
  view?: 'desktop' | 'mobile' | 'all' | 'none';
  onClose?: ({ close }: { close: () => void }) => void;
  children: React.ReactNode | (({ close }: { close: () => void }) => React.ReactNode);
  ariaLabel?: string;
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

  const scrollYRef = React.useRef(0);
  // Tracks whether we actually locked the body for an open popup. Without this,
  // the `else` branch runs on initial mount (popups.length === 0) and calls
  // window.scrollTo(0, 0), which yanks the host page to the top — harmless when
  // the UIKit owns the viewport, but disruptive when a single component (e.g.
  // AmityCommentTrayComponent) is embedded in a scrollable host page that never
  // opens a popup. We only restore scroll after a real open -> close cycle.
  const didLockScrollRef = React.useRef(false);

  // Prevent body scroll when popups are open
  useEffect(() => {
    if (popups.length > 0) {
      // Store original scroll position in ref to restore later
      didLockScrollRef.current = true;
      scrollYRef.current = window.scrollY;
      // Add class to prevent scroll
      document.body.classList.add('popup-no-scroll');
      document.body.style.top = `-${scrollYRef.current}px`;
    } else if (didLockScrollRef.current) {
      // Only restore if we previously locked the body for an open popup, so that
      // mounting the provider (with no popup) never moves the host page.
      didLockScrollRef.current = false;
      // Remove class and restore scroll position
      document.body.classList.remove('popup-no-scroll');
      document.body.style.top = '';
      window.scrollTo(0, scrollYRef.current);
    }
  }, [popups.length]);

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
