import { useEffect, useState } from 'react';

export function useGetInvitation(community: Amity.Community) {
  const [invitation, setInvitation] = useState<Amity.Invitation | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (community && community.getInvitation) {
      setIsLoading(true);
      community
        .getInvitation()
        .then((invitation) => {
          setInvitation(invitation);
          setIsLoading(false);
        })
        .catch(() => {
          setInvitation(undefined);
          setIsLoading(false);
        });
    }
  }, [community]);

  return {
    isLoading,
    invitation,
    setInvitation,
  };
}
