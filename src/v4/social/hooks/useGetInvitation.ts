import { useEffect, useState } from 'react';

export function useGetInvitation(community: Amity.Community) {
  const [invitation, setInvitation] = useState<Amity.Invitation | undefined>();

  useEffect(() => {
    if (community) {
      community?.getInvitation()?.then((invitation) => {
        setInvitation(invitation);
      });
    }
  }, [community]);

  return {
    invitation,
    setInvitation,
  };
}
