import styled from 'styled-components';
import UICommunityForm from '~/social/components/CommunityForm';
import { FormBody } from '~/social/components/CommunityForm/styles';

export const CommunityForm = styled(UICommunityForm)`
  ${FormBody} {
    max-height: 550px;
    overflow-y: auto;
  }
`;
