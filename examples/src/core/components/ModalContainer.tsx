import React from 'react';
import { createPortal } from 'react-dom';

export const ModalContainer = ({ children }: { children: React.ReactNode }) => {
  return createPortal(children, document.body);
};
