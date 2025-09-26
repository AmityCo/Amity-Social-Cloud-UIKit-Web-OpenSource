import React, { createContext, useContext, useState } from 'react';

interface PinnedMessageContextType {
  pinnedMessage: string | undefined;
  setPinnedMessage: (message: string | undefined) => void;
  pinMessage: (message: string) => void;
  clearPinnedMessage: () => void;
}

const PinnedMessageContext = createContext<PinnedMessageContextType | undefined>(undefined);

export const usePinnedMessage = () => {
  const context = useContext(PinnedMessageContext);
  if (!context) {
    throw new Error('usePinnedMessage must be used within a PinnedMessageProvider');
  }
  return context;
};

interface PinnedMessageProviderProps {
  children: React.ReactNode;
}

export const PinnedMessageProvider: React.FC<PinnedMessageProviderProps> = ({ children }) => {
  const [pinnedMessage, setPinnedMessage] = useState<string | undefined>(undefined);

  const pinMessage = (message: string) => {
    setPinnedMessage(message);
  };

  const clearPinnedMessage = () => {
    setPinnedMessage(undefined);
  };

  const value = {
    pinnedMessage,
    setPinnedMessage,
    pinMessage,
    clearPinnedMessage,
  };

  return <PinnedMessageContext.Provider value={value}>{children}</PinnedMessageContext.Provider>;
};
