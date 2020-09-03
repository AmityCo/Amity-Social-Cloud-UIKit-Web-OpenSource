import styled from 'styled-components';
import UICommunityForm from 'components/CommunityForm';
import { FormBody } from 'components/CommunityForm/styles';

export const CommunityForm = styled(UICommunityForm)`
  ${FormBody} {
    max-height: 550px;
    overflow-y: auto;
  }
`;
