import React, { createContext, useContext, useState } from 'react';
import { MemberCommunitySetup } from '~/v4/social/pages/CommunitySetupPage/CommunitySetupPage';

enum AmityCommunitySetupPrivacy {
  PUBLIC = 'public',
  PRIVATE_VISIBLE = 'private_visible',
  PRIVATE_HIDDEN = 'private_hidden',
}

type CommunitySetupContextType = {
  communityName: string;
  setCommunityName: (name: string) => void;
  about?: string;
  setAbout: (about: string) => void;
  categories: Amity.Category[];
  setCategories: (categories: Amity.Category[]) => void;
  privacySettings: AmityCommunitySetupPrivacy;
  setPrivacySettings: (privacy: AmityCommunitySetupPrivacy) => void;
  members: MemberCommunitySetup[];
  setMembers: (members: MemberCommunitySetup[]) => void;
  coverImages: Amity.File[];
  setCoverImages: (coverImages: Amity.File[]) => void;
  isDiscoverable: boolean;
  setIsDiscoverable: (isDiscoverable: boolean) => void;
  requiresJoinApproval: boolean;
  setRequiresJoinApproval: (requiresJoinApproval: boolean) => void;
};

const CommunitySetupContext = createContext<CommunitySetupContextType>({
  communityName: '',
  setCommunityName: (name: string) => {},
  about: '',
  setAbout: (about: string) => {},
  categories: [],
  setCategories: (categories: Amity.Category[]) => {},
  privacySettings: AmityCommunitySetupPrivacy.PUBLIC,
  setPrivacySettings: (privacy: AmityCommunitySetupPrivacy) => {},
  members: [],
  setMembers: (members: MemberCommunitySetup[]) => {},
  coverImages: [],
  setCoverImages: (coverImages: Amity.File[]) => {},
  isDiscoverable: true,
  setIsDiscoverable: (isDiscoverable: boolean) => {},
  requiresJoinApproval: false,
  setRequiresJoinApproval: (requiresJoinApproval: boolean) => {},
});

export const useCommunitySetupContext = () => useContext(CommunitySetupContext);

type CommunitySetupProviderProps = {
  children: React.ReactNode;
};

export const CommunitySetupProvider: React.FC<CommunitySetupProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Amity.Category[]>([]);
  const [communityName, setCommunityName] = useState('');
  const [about, setAbout] = useState('');
  const [isDiscoverable, setIsDiscoverable] = useState<boolean>(true);
  const [requiresJoinApproval, setRequiresJoinApproval] = useState<boolean>(false);
  const [members, setMembers] = useState<MemberCommunitySetup[]>([]);
  const [coverImages, setCoverImages] = useState<Amity.File[]>([]);
  const [privacySettings, setPrivacySettings] = useState<AmityCommunitySetupPrivacy>(
    AmityCommunitySetupPrivacy.PUBLIC,
  );

  const value: CommunitySetupContextType = {
    communityName,
    setCommunityName,
    about,
    setAbout,
    categories,
    setCategories,
    privacySettings,
    setPrivacySettings,
    members,
    setMembers,
    coverImages,
    setCoverImages,
    isDiscoverable,
    setIsDiscoverable,
    requiresJoinApproval,
    setRequiresJoinApproval,
  };

  return <CommunitySetupContext.Provider value={value}>{children}</CommunitySetupContext.Provider>;
};

// Export the enum to make it available for other components
export { AmityCommunitySetupPrivacy };
