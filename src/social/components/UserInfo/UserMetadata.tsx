import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Table, TableContainer, Tbody, Tr, Td, Icon } from '@noom/wax-component-library';

import Time from '~/core/components/Time';
import { useNoomUserMetadata } from '~/social/hooks/useNoomUserMetadata';

type User = {
  userId: string;
  metadata?: {
    userType?: string;
    hasFinishedInitialProfileSync?: boolean;
    isMigratedFromCircles?: boolean;
  };
  createdAt: string;
};

type NoomMetadata = {
  deviceInformation: {
    os: string;
    clientVersion: string;
  };
  localeInformation: {
    language: string;
    timezone: string;
  };
};

export const UIUserMetadata = ({
  user,
  noomMetadata,
}: {
  user: User;
  noomMetadata: NoomMetadata;
}) => (
  <TableContainer>
    <b>
      <FormattedMessage id="userMetadata.title" />
    </b>
    {' - '}
    <FormattedMessage id="userMetadata.helper" />
    <Table variant="simple" size="sm">
      <Tbody>
        <Tr>
          <Td>
            <FormattedMessage id="userMetadata.accessCode" />
          </Td>
          <Td>{user.userId}</Td>
        </Tr>
        <Tr>
          <Td>
            <FormattedMessage id="userMetadata.userType" />
          </Td>
          <Td>{user.metadata?.userType ?? '-'}</Td>
        </Tr>
        <Tr>
          <Td>
            <FormattedMessage id="userMetadata.platform" />
          </Td>
          <Td>
            {noomMetadata?.deviceInformation?.os
              ? noomMetadata?.deviceInformation?.os === 'iOS'
                ? 'iOS'
                : 'Android'
              : '-'}
          </Td>
        </Tr>
        <Tr>
          <Td>
            <FormattedMessage id="userMetadata.appVersion" />
          </Td>
          <Td>{noomMetadata?.deviceInformation?.clientVersion ?? '-'}</Td>
        </Tr>
        <Tr>
          <Td>
            <FormattedMessage id="userMetadata.language" />
          </Td>
          <Td>{noomMetadata?.localeInformation?.language ?? '-'}</Td>
        </Tr>
        <Tr>
          <Td>
            <FormattedMessage id="userMetadata.timezone" />
          </Td>
          <Td>{noomMetadata?.localeInformation?.timezone ?? '-'}</Td>
        </Tr>
        <Tr>
          <Td>
            <FormattedMessage id="userMetadata.dateJoined" />
          </Td>
          <Td>{user.createdAt && <Time date={user.createdAt} />}</Td>
        </Tr>
        <Tr>
          <Td>
            <FormattedMessage id="userMetadata.hasFinishedInitialProfileSync" />
          </Td>
          <Td>
            {user.metadata?.hasFinishedInitialProfileSync ? (
              <Icon icon="check" />
            ) : (
              <Icon icon="close" />
            )}
          </Td>
        </Tr>
        <Tr>
          <Td>
            <FormattedMessage id="userMetadata.isMigratedFromCircles" />
          </Td>
          <Td>
            {user.metadata?.isMigratedFromCircles ? <Icon icon="check" /> : <Icon icon="close" />}
          </Td>
        </Tr>
      </Tbody>
    </Table>
  </TableContainer>
);

export const UserMetadata = ({ user }: { user: User }) => {
  const noomMetadata = useNoomUserMetadata(user.userId) as NoomMetadata;
  return <UIUserMetadata user={user} noomMetadata={noomMetadata} />;
};
