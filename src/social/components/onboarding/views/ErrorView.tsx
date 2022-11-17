import React from 'react';
import {
  Alert,
  ModalBody,
  ModalFooter,
  CompassColor,
  ModalContent,
  ModalHeader,
} from '@noom/wax-component-library';
import { FormattedMessage } from 'react-intl';

import Button, { PrimaryButton, ButtonGroup } from '~/core/components/Button';

export type ErrorViewProps = {
  isLoading?: boolean;
  onReset: () => void;
  onCancel: () => void;
  error?: string;
};

export function ErrorView({ isLoading, onReset, onCancel }: ErrorViewProps) {
  return (
    <ModalContent bg={CompassColor.offWhite}>
      <ModalHeader>
        <FormattedMessage id="onboarding.error.title" />
      </ModalHeader>
      <ModalBody>
        <Alert status="error">
          <FormattedMessage id="onboarding.error.message" />
        </Alert>
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button isLoading={isLoading} onClick={onCancel}>
            <FormattedMessage id="onboarding.error.cancel" />
          </Button>
          <PrimaryButton isLoading={isLoading} onClick={onReset}>
            <FormattedMessage id="onboarding.error.reset" />
          </PrimaryButton>
        </ButtonGroup>
      </ModalFooter>
    </ModalContent>
  );
}
