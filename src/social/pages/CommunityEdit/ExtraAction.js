import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { confirm } from '~/core/components/Confirm';
import {
  ExtraActionContainer,
  ExtraActionContainerHeader,
  ExtraActionContainerBody,
  ExtraActionButton,
  ExtraActionPrimaryButton,
  PlusIcon,
  Footer,
} from './styles';

import useCommunity from '~/social/hooks/useCommunity';

const ExtraAction = ({ title, bodyText, actionButton }) => {
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

const AddMemberButton = ({ onClick }) => {
  return (
    <ExtraActionPrimaryButton onClick={onClick}>
      <PlusIcon />
      <FormattedMessage id="add" />
    </ExtraActionPrimaryButton>
  );
};

const CloseCommunityButton = ({ onClick }) => {
  return (
    <ExtraActionButton onClick={onClick}>
      <FormattedMessage id="close" />
    </ExtraActionButton>
  );
};

export const AddMemberAction = ({ action }) => {
  return (
    <ExtraAction
      title={<FormattedMessage id="AddMemberAction.title" />}
      bodyText={<FormattedMessage id="AddMemberAction.description" />}
      actionButton={<AddMemberButton onClick={action} />}
    />
  );
};

export const CloseCommunityAction = ({ communityId, onCommunityClosed }) => {
  const { closeCommunity } = useCommunity(communityId);
  const { formatMessage } = useIntl();

  const closeConfirm = () =>
    confirm({
      title: formatMessage({ id: 'CloseCommunityAction.closeConfirm.title' }),
      content: formatMessage({ id: 'CloseCommunityAction.closeConfirm.description' }),
      cancelText: formatMessage({ id: 'cancel' }),
      okText: formatMessage({ id: 'close' }),
      onOk: () => {
        closeCommunity();
        onCommunityClosed();
      },
    });

  return (
    <ExtraAction
      title={<FormattedMessage id="CloseCommunityAction.title" />}
      bodyText={<FormattedMessage id="CloseCommunityAction.description" />}
      actionButton={<CloseCommunityButton onClick={closeConfirm} />}
    />
  );
};
