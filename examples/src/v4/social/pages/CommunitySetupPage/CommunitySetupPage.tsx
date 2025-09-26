import React from 'react';
import { CreateCommunity } from '~/v4/social/internal-components/CreateCommunity';
import { EditCommunity } from '~/v4/social/internal-components/EditCommunity';

type MemberCommunitySetup = {
  userId: string;
  displayName: string;
};

enum AmityCommunitySetupPageMode {
  CREATE = 'create',
  EDIT = 'edit',
}
interface CommunitySetupEditOptions {
  mode: AmityCommunitySetupPageMode.EDIT;
  community: Amity.Community;
}

interface CommunitySetupCreateOptions {
  mode: AmityCommunitySetupPageMode.CREATE;
}

type CommunitySetupPageProps = CommunitySetupCreateOptions | CommunitySetupEditOptions;

const isCreatePage = (props: CommunitySetupPageProps): props is CommunitySetupCreateOptions => {
  return props.mode === AmityCommunitySetupPageMode.CREATE;
};

const CommunitySetupPage = (props: CommunitySetupPageProps) => {
  if (isCreatePage(props)) {
    return <CreateCommunity mode={AmityCommunitySetupPageMode.CREATE} />;
  } else {
    const { community } = props;
    return <EditCommunity mode={AmityCommunitySetupPageMode.EDIT} community={community} />;
  }
};

export {
  CommunitySetupPage,
  CommunitySetupPageProps,
  AmityCommunitySetupPageMode,
  MemberCommunitySetup,
};
