import React from 'react';
import { FormattedMessage } from 'react-intl';
import Modal from '~/core/components/Modal';
import { MagicWand } from '~/icons';
import { Content, GoToSettingsButton, Message, SkipButton, Title } from './styles';

export default ({ onClose, onGoSettings }) => {
  return (
    <Modal>
      <Content>
        <MagicWand />

        <Title>
          <FormattedMessage id="communityCreatedModal.title" />
        </Title>

        <Message>
          <FormattedMessage id="communityCreatedModal.message" />
        </Message>

        <GoToSettingsButton onClick={onGoSettings}>
          <FormattedMessage id="communityCreatedModal.goToSettings" />
        </GoToSettingsButton>

        <SkipButton onClick={onClose}>
          <FormattedMessage id="communityCreatedModal.skip" />
        </SkipButton>
      </Content>
    </Modal>
  );
};
