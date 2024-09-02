import styled from 'styled-components';
import CommunitySideMenu from '~/social/components/CommunitySideMenu';
import { BarsIcon } from '~/icons/index';

export const Wrapper = styled.div`
  height: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding: 28px 0;
  overflow-y: auto;
`;

export const HeadTitle = styled.h2`
  ${({ theme }) => theme.typography.headline};
`;

export const MobileContainer = styled.div`
  @media (min-width: 768px) {
    /* Updated media query for screens wider than 767px */
    display: none; /* Hide on desktop and tablet */
  }

  @media (max-width: 767px) {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    gap: 0.975rem;
    background: #fff;
    height: 58px;
    padding: 1rem;
  }
`;

export const CommunitySideMenuOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition:
    opacity 0.3s ease-in-out,
    visibility 0.3s ease-in-out;
  cursor: pointer;
`;

export const StyledCommunitySideMenu = styled(CommunitySideMenu)<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  min-height: 100%;
  height: 100%;
  z-index: 999;
  transform: translateX(${({ isOpen }) => (isOpen ? 0 : '-100%')});
  transition: transform 0.3s ease-in-out;
`;

export const StyledBarsIcon = styled(BarsIcon)`
  cursor: pointer;
`;
