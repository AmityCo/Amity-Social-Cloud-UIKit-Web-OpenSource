import React from 'react';

import { Modal, ModalProps, ModalOverlay } from '@noom/wax-component-library';

import { ErrorView } from './views/ErrorView';
import { WelcomeView } from './views/WelcomeView';
import { InterestSelectView, InterestSelectViewProps } from './views/InterestSelectView';
import { CommunitySelectView, CommunitySelectViewProps } from './views/CommunitySelectView';
import { Community, Interest } from './models';

export enum OnboardingStep {
  welcome,
  interests,
  communities,
}

type OnboardingProps = {
  isLoading?: boolean;
  error?: string;
  step?: OnboardingStep;
  onCancel: () => void;
  onReset: () => void;
  onSubmit: () => void;
  onSubmitInterests: (interests: Interest[]) => void;
  onSubmitCommunities: (interests: Community[]) => void;
  fireworksImageUrl?: string;
} & Pick<InterestSelectViewProps, 'interests'> &
  Pick<CommunitySelectViewProps, 'communities'>;

export type OnboardingModalProps = OnboardingProps & Omit<ModalProps, 'children'>;

function OnboardingContent({
  step,
  error,
  isLoading,
  interests,
  communities,
  onSubmit,
  onCancel,
  onReset,
  onSubmitInterests,
  onSubmitCommunities,
  fireworksImageUrl,
}: OnboardingProps) {
  if (error) {
    return <ErrorView onCancel={onCancel} onReset={onReset} error={error} />;
  }

  if (step === OnboardingStep.welcome)
    return (
      <WelcomeView
        isLoading={isLoading}
        onSubmit={onSubmit}
        fireworksImageUrl={fireworksImageUrl}
      />
    );

  if (step === OnboardingStep.interests)
    return (
      <InterestSelectView
        interests={interests}
        isLoading={isLoading}
        onSubmit={onSubmitInterests}
      />
    );

  if (step === OnboardingStep.communities)
    return (
      <CommunitySelectView
        communities={communities}
        isLoading={isLoading}
        onSubmit={onSubmitCommunities}
      />
    );

  return null;
}

export function OnboardingModal({
  error,
  step = OnboardingStep.welcome,
  isLoading,
  onReset,
  onCancel,
  onSubmit,
  onSubmitInterests,
  onSubmitCommunities,
  interests,
  communities,
  fireworksImageUrl,
  ...props
}: OnboardingModalProps) {
  return (
    <Modal {...props} motionPreset="none" scrollBehavior="inside">
      <ModalOverlay />
      <OnboardingContent
        step={step}
        error={error}
        isLoading={isLoading}
        interests={interests}
        communities={communities}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onReset={onReset}
        onSubmitInterests={onSubmitInterests}
        onSubmitCommunities={onSubmitCommunities}
        fireworksImageUrl={fireworksImageUrl}
      />
    </Modal>
  );
}
