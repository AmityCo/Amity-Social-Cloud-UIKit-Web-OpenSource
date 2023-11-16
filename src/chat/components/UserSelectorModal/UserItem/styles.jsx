import styled from 'styled-components';

export const Usercontainer = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #f7f7f8;
  }
`;

export const AvatarContainer = styled.div`
  display: flex;
  margin-right: 8px;
`;

export const ProfileContainer = styled.div`
  display: flex;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: -0.2px;
`;

export const CheckIconWrapper = styled.div`
  display: flex;
  margin-left: auto;
  color: ${({ theme }) => theme.palette.primary.main};

  svg {
    font-size: 16px;
  }
`;
