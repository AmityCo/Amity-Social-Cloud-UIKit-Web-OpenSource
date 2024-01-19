import React from 'react';
import { FormattedMessage } from 'react-intl';
import Modal from '~/core/components/Modal';
import { MagicWand } from '~/icons';
import { Content, GoToSettingsButton, Message, SkipButton, Title } from './styles';

interface CommunityCreatedModalProps {
  onClose: () => void;
  onGoSettings: () => void;
}

export default function CommunityCreatedModal({
  onClose,
  onGoSettings,
}: CommunityCreatedModalProps) {
  return (
    <Modal data-qa-anchor="community-created-modal">
      <Content>
        <MagicWand />

        <Title data-qa-anchor="community-created-modal-title">
          <FormattedMessage id="communityCreatedModal.title" />
        </Title>

        <Message data-qa-anchor="community-created-modal-message">
          <FormattedMessage id="communityCreatedModal.message" />
        </Message>

        <GoToSettingsButton
          data-qa-anchor="community-created-modal-go-to-settings-button"
          onClick={onGoSettings}
        >
          <FormattedMessage id="communityCreatedModal.goToSettings" />
        </GoToSettingsButton>

        <SkipButton data-qa-anchor="community-created-modal-skip-button" onClick={onClose}>
          <FormattedMessage id="communityCreatedModal.skip" />
        </SkipButton>
      </Content>
    </Modal>
  );
}
