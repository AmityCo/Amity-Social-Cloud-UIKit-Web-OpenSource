import { MessageRepository } from '@amityco/ts-sdk';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const useMessageFlaggedByMe = (messageId?: string) => {
  const [isFlaggedByMe, setIsFlaggedByMe] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['asc-uikit', 'MessageRepository', 'isMessageFlaggedByMe', messageId],
    queryFn: () => {
      return MessageRepository.isMessageFlaggedByMe(messageId as string);
    },
    enabled: messageId != null,
  });

  useEffect(() => {
    if (data != null) {
      setIsFlaggedByMe(data);
    }
  }, [data]);

  const flagMessage = async () => {
    if (messageId == null) return;
    try {
      setIsFlaggedByMe(true);
      await MessageRepository.flagMessage(messageId);
    } catch (_error) {
      setIsFlaggedByMe(false);
    } finally {
      refetch();
    }
  };

  const unflagMessage = async () => {
    if (messageId == null) return;
    try {
      setIsFlaggedByMe(false);
      await MessageRepository.unflagMessage(messageId);
    } catch (_error) {
      setIsFlaggedByMe(true);
    } finally {
      refetch();
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
