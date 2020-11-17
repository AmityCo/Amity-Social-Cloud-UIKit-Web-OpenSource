import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';

export const PostCreatorTextareaWrapper = styled.div`
  border: none;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border-radius: 4px;
  min-height: 40px;
`;

export const PostCreatorTextarea = styled(TextareaAutosize).attrs({ rows: 1, maxRows: 15 })`
  padding: 0;
  outline: none;
  border: none;
  border-radius: 4px;
  resize: none;
  font: inherit;
`;

export const FooterActionBar = styled.div`
  display: flex;
  align-items: center;

  > *:not(:last-child) {
    margin-right: 20px;
  }
`;
