import React, { useState } from 'react';

import { OnboardingModal as UIOnboardingModal, OnboardingModalProps } from './OnboardingModal';

import { interests as interestsMock, communities as communitiesMock } from './mocks';

export default {
  title: 'Ui Only',
};

export const OnboardingModal = ({ ...props }: OnboardingModalProps) => {
  const [step, setStep] = useState(0);

  return <UIOnboardingModal {...props} step={step} onSubmit={(step) => setStep((step + 1) % 3)} />;
};

const argTypes = {
  isLoading: { control: { type: 'boolean' } },
  isOpen: { control: { type: 'boolean' } },
  onClose: { action: 'onClose' },
  onSubmit: { action: 'onSubmit' },
  error: { control: { type: 'text' } },
};

const args = {
  isLoading: false,
  isOpen: true,
  autoFocus: false,
  interests: interestsMock,
  communities: communitiesMock,
};

OnboardingModal.argTypes = argTypes;
OnboardingModal.args = args;
