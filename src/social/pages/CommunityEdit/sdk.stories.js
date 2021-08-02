import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOneCommunity from '~/mock/useOneCommunity';
import CommunityEdit from '.';

export default {
  title: 'SDK Connected/Social/Pages',
};

export const SDKCommunityEdit = props => {
  const [community, isLoading] = useOneCommunity();
  if (isLoading)
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );
  return <CommunityEdit {...props} communityId={community.communityId} />;
};

SDKCommunityEdit.storyName = 'Community Edit';
