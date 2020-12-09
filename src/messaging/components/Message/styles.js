import styled from 'styled-components';
import UiKitAvatar from '~/core/components/Avatar';
import { Close, EllipsisV, Save, Trash } from '~/icons';

export const SystemMessageContainer = styled.span`
  opacity: 0.5;
`;

export const EditingContainer = styled.div`
  display: flex;
  align-items: center;
`;
export const EditingInput = styled.input`
  height: 34px;
  padding: 6px;
  margin: 5px;
  outline: none;
  border: 1px solid #e3e4e8;
  border-radius: 4px;
`;

export const SaveIcon = styled(Save)`
  opacity: 0.7;
  padding: 0 10px;
  cursor: pointer;
`;

export const DeleteIcon = styled(Trash)`
  opacity: 0.7;
  padding: 0 10px;
  cursor: pointer;
`;

export const CloseIcon = styled(Close)`
  opacity: 0.7;
  padding: 0 10px;
  cursor: pointer;
`;

export const MessageOptionsIcon = styled(EllipsisV)`
  opacity: 0.5;
  font-size: 11px;
  padding: 0 5px;
  cursor: pointer;
`;

export const Avatar = styled(UiKitAvatar)`
  margin-right: auto;
`;

export const MessageWrapper = styled.div`
  display: flex;
  max-width: 60%;
  min-width: 60px;
  ${({ incoming }) => !incoming && 'align-self: flex-end;'}
`;

export const MessageContainer = styled.div``;

export const AvatarWrapper = styled.div`
  width: 52px;
  flex-shrink: 0;
`;

export const UserName = styled.div`
  color: ${({ theme }) => theme.palette.neutral.main};
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const MessageBody = styled.div`
  word-break: break-word;
  padding: 8px;
  margin-bottom: 8px;

  display: flex;
  flex-direction: column;
  ${({ theme, incoming }) =>
    incoming
      ? `
  background: #e3e4e8;
  border-radius: 0px 6px 6px 6px;
`
      : `
  background: ${theme.palette.primary.main};
  color: #fff;
  border-radius: 6px 0px 6px 6px;
`}
`;

export const MessageDate = styled.div`
  font-size: 13px;
  opacity: 0.5;
  margin-left: auto;
`;

export const BottomLine = styled.div`
  margin-top: 3px;
  display: flex;
  align-items: center;
`;
