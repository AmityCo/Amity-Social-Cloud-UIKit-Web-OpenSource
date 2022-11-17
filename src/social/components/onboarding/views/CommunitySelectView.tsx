import React, { useState } from 'react';
import {
  ModalBody,
  ModalFooter,
  ModalContent,
  Box,
  H3,
  ModalHeader,
} from '@noom/wax-component-library';
import { FormattedMessage } from 'react-intl';

import { PrimaryButton } from '~/core/components/Button';

import { Community as CommunityData } from '../models';
import { CommunitySelect } from '../components/CommunitySelect';

export type CommunitySelectViewProps = {
  isLoading?: boolean;
  onSubmit: (communities: CommunityData[]) => void;
  error?: string;
  communities?: CommunityData[];
};

export function CommunitySelectView({
  isLoading,
  onSubmit,
  communities = [],
}: CommunitySelectViewProps) {
  const [selected, setSelected] = useState<CommunityData[]>([]);

  return (
    <ModalContent>
      <ModalHeader>
        <H3 fontWeight="500">
          <FormattedMessage id="onboarding.communities.title" />
        </H3>
      </ModalHeader>
      <ModalBody>
        <CommunitySelect communities={communities} isDisabled={isLoading} onChange={setSelected} />
      </ModalBody>
      <ModalFooter>
        <PrimaryButton isFullWidth isLoading={isLoading} onClick={() => onSubmit(selected)}>
          <FormattedMessage id="onboarding.communities.button" />
        </PrimaryButton>
      </ModalFooter>
    </ModalContent>
  );
}
