import styled from 'styled-components';
import UICommunityForm from '../CommunityForm';
import { FormBody } from '../CommunityForm/styles';

export const CommunityForm = styled(UICommunityForm)`
  ${FormBody} {
    max-height: 550px;
    overflow-y: auto;
  }
`;
