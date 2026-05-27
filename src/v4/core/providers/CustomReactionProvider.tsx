import React, { createContext, useContext, useMemo } from 'react';
import { useCustomization } from './CustomizationProvider';
import { withLegacyReactions } from '~/v4/core/constants/meetperryReactions';

export type AmityReactionType = {
  name: string;
  image: string;
};

const CustomReactionContext = createContext<{
  reactions: AmityReactionType[];
  socialReactions: AmityReactionType[];
  displayReactions: AmityReactionType[];
  displaySocialReactions: AmityReactionType[];
}>({
  reactions: [],
  socialReactions: [],
  displayReactions: [],
  displaySocialReactions: [],
});

export const useCustomReaction = () => {
  return useContext(CustomReactionContext);
};

export const CustomReactionProvider: React.FC = ({ children }) => {
  const { config } = useCustomization();
  const [reactions, setReactions] = React.useState<AmityReactionType[]>([]);
  const [socialReactions, setSocialReactions] = React.useState<AmityReactionType[]>([]);

  React.useEffect(() => {
    if (!config) return;

    const reactionConfig = config?.message_reactions;
    if (!reactionConfig) return;

    setReactions(reactionConfig);
  }, [config]);

  React.useEffect(() => {
    if (!config) return;

    const socialReactionConfig = config?.social_reactions;
    if (!socialReactionConfig) return;

    setSocialReactions(socialReactionConfig);
  }, [config]);

  const displayReactions = useMemo(() => withLegacyReactions(reactions), [reactions]);
  const displaySocialReactions = useMemo(
    () => withLegacyReactions(socialReactions),
    [socialReactions],
  );

  return (
    <CustomReactionContext.Provider
      value={{ reactions, socialReactions, displayReactions, displaySocialReactions }}
    >
      {children}
    </CustomReactionContext.Provider>
  );
};
