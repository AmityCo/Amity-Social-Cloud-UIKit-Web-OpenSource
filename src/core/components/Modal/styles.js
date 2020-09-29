import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';

export const CloseIcon = styled(FaIcon).attrs({ icon: faTimes })`
  padding: 0 6px;
  font-size: 18px;
  cursor: pointer;
  margin-left: auto;
`;

export const Overlay = styled.div`
  z-index: 9999;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow-y: auto;
  display: flex;
  padding: 20px 0;
  background: rgba(23, 24, 28, 0.8);
  animation-duration: 0.3s;
  animation-name: appear;

  @keyframes appear {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;

export const ModalWindow = styled.div`
  margin: auto;
  background: white;
  border-radius: 6px;
  max-width: 520px;
  min-width: 360px;
  ${({ theme }) => theme.typography.body}
`;

export const Header = styled.div`
  padding: 16px 16px 12px 16px;
  ${({ clean }) => !clean && `border-bottom: 1px solid${({ theme }) => theme.palette.base.shade4};`}
  ${({ theme }) => theme.typography.title}
  display: flex;
  align-items: center;
`;

export const Content = styled.div`
  ${({ isText }) => isText && 'padding: 20px 16px;'}
`;

export const Footer = styled.div`
  padding: 16px 12px;
  padding-top: 4px;
  ${({ clean }) =>
    !clean &&
    `
border-top: 1px solid${({ theme }) => theme.palette.base.shade4};
padding-top: 16px;
    `}
`;
