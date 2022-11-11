import React from 'react';

import { Modal, ModalProps, ModalOverlay } from '@noom/wax-component-library';

import { WelcomeView } from './views/WelcomeView';
import { InterestSelectView, InterestSelectViewProps } from './views/InterestSelectView';
import { CommunitySelectView, CommunitySelectViewProps } from './views/CommunitySelectView';

export enum OnboardingStep {
  welcome,
  interests,
  communities,
}

export type OnboardingModalProps = {
  isLoading?: boolean;
  step?: OnboardingStep;
  onSubmit: (step: OnboardingStep) => void;
} & Pick<InterestSelectViewProps, 'interests'> &
  Pick<CommunitySelectViewProps, 'communities'> &
  ModalProps;

export function OnboardingModal({
  step = OnboardingStep.communities,
  isLoading,
  onSubmit,
  interests,
  communities,
  ...props
}: OnboardingModalProps) {
  return (
    <Modal {...props} motionPreset="none" scrollBehavior="inside">
      <ModalOverlay />

      {step === OnboardingStep.welcome ? (
        <WelcomeView isLoading={isLoading} onSubmit={() => onSubmit(step)} />
      ) : null}
      {step === OnboardingStep.interests ? (
        <InterestSelectView
          interests={interests}
          isLoading={isLoading}
          onSubmit={() => onSubmit(step)}
        />
      ) : null}
      {step === OnboardingStep.communities ? (
        <CommunitySelectView
          communities={communities}
          isLoading={isLoading}
          onSubmit={() => onSubmit(step)}
        />
      ) : null}
    </Modal>
  );
}
