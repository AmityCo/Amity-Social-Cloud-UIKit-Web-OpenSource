import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faCommentAlt } from '@fortawesome/pro-regular-svg-icons';

export const EngagementBarContainer = styled.div`
  color: #818698;
  ${({ theme }) => theme.typography.body}
`;

export const Counters = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e3e4e8;
  padding: 8px 0;
`;

export const InteractionBar = styled.div`
  display: flex;
  padding: 2px 0;
`;

export const CommentIcon = styled(FaIcon).attrs({ icon: faCommentAlt })`
  position: relative;
  font-size: 16px;
  margin-right: 5px;
`;
