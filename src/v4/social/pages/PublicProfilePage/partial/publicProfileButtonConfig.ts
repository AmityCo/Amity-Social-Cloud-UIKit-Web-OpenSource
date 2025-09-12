export type ProfileMenuItem = {
  id: string;
  text: string;
  icon: string;
  action: () => void;
};
// profile options TBD if need more
export const getProfileMenuItems = (): ProfileMenuItem[] => {
  const actions = {
    onFollowUser: () => console.log('Follow user'),
    onReportUser: () => console.log('Report user'),
    onShareProfile: () => console.log('Share profile'),
    onBlockUser: () => console.log('Block user'),
  };

  return [
    {
      id: 'follow-user',
      text: 'Segui anche tu',
      icon: 'AddUser',
      action: actions.onFollowUser,
    },
    {
      id: 'share-profile',
      text: 'Condividi profilo pubblico',
      icon: 'CopyLink',
      action: actions.onShareProfile,
    },
    {
      id: 'report-user',
      text: 'Segnala utente',
      icon: 'FlagIcon',
      action: actions.onReportUser,
    },
    {
      id: 'block-user',
      text: 'Blocca utente',
      icon: 'Lock',
      action: actions.onBlockUser,
    },
  ];
};
