import styled from 'styled-components';
import Sheet from 'react-modal-sheet';
import { SecondaryButton } from '~/core/components/Button';

export const MobileSheet = styled(Sheet)`
  margin: 0 auto;
  width: 100%;
`;

export const MobileSheetNestedBackDrop = styled(MobileSheet.Backdrop)`
  background-color: rgba(0, 0, 0, 0.5);
`;

export const MobileSheetContainer = styled(MobileSheet.Container)`
  z-index: 101;
`;

export const MobileSheetHeader = styled(MobileSheet.Header)`
  ${({ theme }) => theme.typography.title};
  color: ${({ theme }) => theme.palette.base.default};
  text-align: center;
  border-bottom: 1px solid #e3e4e8;
  padding-bottom: 0.5rem;
  z-index: 100;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
`;

export const MobileSheetContent = styled(MobileSheet.Content)`
  z-index: 100;
`;

export const MobileSheetButton = styled(SecondaryButton)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
`;
