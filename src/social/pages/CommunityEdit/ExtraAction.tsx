import React, { ReactNode } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  ExtraActionContainer,
  ExtraActionContainerHeader,
  ExtraActionContainerBody,
  ExtraActionButton,
  ExtraActionPrimaryButton,
  PlusIcon,
  Footer,
} from './styles';

import { CommunityRepository } from '@amityco/ts-sdk';
import { useConfirmContext } from '~/core/providers/ConfirmProvider';

interface ExtraActionProps {
  title?: ReactNode;
  bodyText?: ReactNode;
  actionButton?: ReactNode;
}

const ExtraAction = ({ title, bodyText, actionButton }: ExtraActionProps) => {
  return (
    <ExtraActionContainer>
      <ExtraActionContainerHeader>{title}</ExtraActionContainerHeader>
      <ExtraActionContainerBody>
        <div>{bodyText}</div>
        <Footer>{actionButton}</Footer>
      </ExtraActionContainerBody>
    </ExtraActionContainer>
  );
};

interface AddMemberButtonProps {
  onClick?: () => void;
}

const AddMemberButton = ({ onClick }: AddMemberButtonProps) => {
  return (
    <ExtraActionPrimaryButton data-qa-anchor="community-edit-add-member-button" onClick={onClick}>
      <PlusIcon />
      <FormattedMessage id="add" />
    </ExtraActionPrimaryButton>
  );
};

interface CloseCommunityButtonProps extends ExtraActionProps {
  onClick?: () => void;
}

const CloseCommunityButton = ({ onClick, ...props }: CloseCommunityButtonProps) => {
  return (
    <ExtraActionButton {...props} onClick={onClick}>
      <FormattedMessage id="close" />
    </ExtraActionButton>
  );
};

interface AddMemberActionProps {
  action?: () => void;
}

export const AddMemberAction = ({ action }: AddMemberActionProps) => {
  return (
    <ExtraAction
      title={<FormattedMessage id="AddMemberAction.title" />}
      bodyText={<FormattedMessage id="AddMemberAction.description" />}
      actionButton={<AddMemberButton onClick={action} />}
    />
  );
};

interface CloseCommunityActionProps {
  communityId?: string;
  onCommunityClosed?: () => void;
}

export const CloseCommunityAction = ({
  communityId,
  onCommunityClosed,
}: CloseCommunityActionProps) => {
  const { formatMessage } = useIntl();
  const { confirm } = useConfirmContext();

  const closeConfirm = () =>
    confirm({
      'data-qa-anchor': 'close-community',
      title: formatMessage({ id: 'CloseCommunityAction.closeConfirm.title' }),
      content: formatMessage({ id: 'CloseCommunityAction.closeConfirm.description' }),
      cancelText: formatMessage({ id: 'cancel' }),
      okText: formatMessage({ id: 'close' }),
      onOk: async () => {
        if (!communityId) return;
        await CommunityRepository.deleteCommunity(communityId);
        onCommunityClosed?.();
      },
    });

  return (
    <ExtraAction
      title={<FormattedMessage id="CloseCommunityAction.title" />}
      bodyText={<FormattedMessage id="CloseCommunityAction.description" />}
      actionButton={
        <CloseCommunityButton
          data-qa-anchor="community-edit-close-community-button"
          onClick={closeConfirm}
        />
      }
    />
  );
};
