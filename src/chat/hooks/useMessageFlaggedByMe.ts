import { MessageRepository } from '@amityco/ts-sdk';
import { useEffect, useState } from 'react';

const useMessageFlaggedByMe = (messageId?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFlaggedByMe, setIsFlaggedByMe] = useState(false);

  useEffect(() => {
    if (!messageId) return;
    MessageRepository.isMessageFlaggedByMe(messageId).then((value) => {
      setIsFlaggedByMe(value);
      setIsLoading(false);
    });
  }, [messageId]);

  const flagMessage = async () => {
    if (messageId == null) return;
    try {
      setIsFlaggedByMe(true);
      await MessageRepository.flagMessage(messageId);
    } catch (_error) {
      setIsFlaggedByMe(false);
    }
  };

  const unflagMessage = async () => {
    if (messageId == null) return;
    try {
      setIsFlaggedByMe(false);
      await MessageRepository.unflagMessage(messageId);
    } catch (_error) {
      setIsFlaggedByMe(true);
    }
  };

  const toggleFlagMessage = async () => {
    if (messageId == null) return;
    if (isFlaggedByMe) {
      unflagMessage();
    } else {
      flagMessage();
    }
  };

  return {
    isLoading,
    isFlaggedByMe,
    flagMessage,
    unflagMessage,
    toggleFlagMessage,
  };
};

export default useMessageFlaggedByMe;
