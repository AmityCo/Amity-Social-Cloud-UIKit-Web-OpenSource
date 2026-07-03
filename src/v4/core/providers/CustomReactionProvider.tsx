import React, { createContext, useContext } from 'react';
import { resolveString } from '~/v4/core/localization';
import { useCustomization } from './CustomizationProvider';

export type AmityReactionType = {
  name: string;
  image: string;
};

const CustomReactionContext = createContext<{
  reactions: AmityReactionType[];
  socialReactions: AmityReactionType[];
  getReactionLabel: (reactionName: string) => string;
  getChatReactionLabel: (reactionName: string) => string;
}>({
  reactions: [],
  socialReactions: [],
  getReactionLabel: (reactionName) => reactionName,
  getChatReactionLabel: (reactionName) => reactionName,
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

  const getReactionLabel = (reactionName: string): string => {
    const name = reactionName.toLowerCase();
    return resolveString(`amity_social_button_reaction_${name}`) || reactionName;
  };

  const getChatReactionLabel = (reactionName: string): string => {
    const name = reactionName.toLowerCase();
    const key = `amity_chat_reaction_label_${name}`;
    const localized = resolveString(key);
    return localized === key ? reactionName : localized;
  };

  return (
    <CustomReactionContext.Provider
      value={{ reactions, socialReactions, getReactionLabel, getChatReactionLabel }}
    >
      {children}
    </CustomReactionContext.Provider>
  );
};
