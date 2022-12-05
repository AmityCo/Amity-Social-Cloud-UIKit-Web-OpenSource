import styled from 'styled-components';

export const VoteItemContainer = styled.div`
  padding: 14px 0;
  border-radius: 4px;
  border: 1px solid
    ${({ theme, checked }) => (checked ? theme.palette.primary.main : theme.palette.base.shade4)};
  margin-bottom: 12px;
`;

export const ResultItemContainer = styled.div`
  padding: 12px;
  border: 1px solid
    ${({ theme, checked }) => (checked ? theme.palette.primary.main : theme.palette.base.shade4)};
  ${({ checked, theme }) =>
    checked &&
    `
    border-left: 5px solid ${theme.palette.primary.main};
  `};
  border-radius: 4px;
  margin-bottom: 12px;

  > *:not(:last-child) {
    margin-top: 8px;
  }
`;

export const Title = styled.div`
  font-weight: bold;
`;

export const Text = styled.div`
  font-weight: 600;
`;

export const PollInformation = styled.div`
  display: flex;
  justify-content: space-between;

  :last-child {
    margin-left: auto;
  }

  margin-top: 20px;
  margin-bottom: 12px;
`;

export const SubmitButton = styled.a.attrs({ role: 'button' })`
  display: block;
  width: 100%;
  text-align: center;
  font-size: 14px;
  font-weight: 600;

  ${({ disabled, theme }) =>
    disabled ? theme.palette.primary.shade2 : theme.palette.primary.main}};

  &:hover {
    cursor: pointer;
  }
`;

export const ChipContainer = styled.div`
  display: flex;
  align-items: center;

  > :first-child {
    margin-left: 14px;
  }

  > :last-child {
    margin-left: 10px;
  }

  &:hover {
    cursor: pointer;
  }
`;

export const VoteCounter = styled.div`
  margin-left: auto;
  color: ${({ theme }) => theme.palette.base.shade2};
  font-size: 12px;
  font-weight: 400;
`;

export const ProgressBarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 14px;
  background-color: ${({ theme }) => theme.palette.background.main};
  border-radius: 8px;
  overflow: hidden;
`;

export const ProgressBar = styled.div`
  position: absolute;
  border-radius: 8px;
  width: ${({ percentage = 0 }) => `${percentage}%`};
  height: 100%;
  background: ${({ checked, theme }) =>
    checked ? theme.palette.primary.main : theme.palette.base.shade2};
`;
