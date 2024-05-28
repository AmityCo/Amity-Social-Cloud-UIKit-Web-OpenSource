import React, { createContext, useContext } from 'react';
import { useCustomization } from './CustomizationProvider';

export type AmityReactionType = {
  name: string;
  image: string;
};

const CustomReactionContext = createContext<AmityReactionType[]>([]);

export const useCustomReaction = () => {
  const config = useContext(CustomReactionContext);
  return { config };
};

export const CustomReactionProvider: React.FC = ({ children }) => {
  const { config } = useCustomization();
  const [reactions, setReactions] = React.useState<AmityReactionType[]>([]);

  React.useEffect(() => {
    if (!config) return;

    const reactionConfig = config?.message_reactions;
    if (!reactionConfig) return;

    setReactions(reactionConfig);
  }, [config]);

  return (
    <CustomReactionContext.Provider value={reactions}>{children}</CustomReactionContext.Provider>
  );
};
