import React, { createContext, useContext } from 'react';
import { useCustomization } from './CustomizationProvider';

export type AmityReactionType = {
  name: string;
  image: string;
};

const CustomReactionContext = createContext<{
  reactions: AmityReactionType[];
  socialReactions: AmityReactionType[];
}>({
  reactions: [],
  socialReactions: [],
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

  return (
    <CustomReactionContext.Provider value={{ reactions, socialReactions }}>
      {children}
    </CustomReactionContext.Provider>
  );
};
