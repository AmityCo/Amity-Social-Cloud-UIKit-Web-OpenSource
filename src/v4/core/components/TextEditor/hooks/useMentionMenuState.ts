import { useState, useCallback, useMemo, useRef } from 'react';

export const useMentionMenuState = () => {
  const [isMentionMenuManuallyClosed, setIsMentionMenuManuallyClosed] = useState(false);
  const lastQueryString = useRef<string | null>(null);

  const createQueryChangeHandler = useCallback(
    (originalOnQueryChange: (query: string | null) => void) => {
      return (newQuery: string | null) => {
        // If query changed (user typed @), reset the manual close flag
        if (newQuery !== lastQueryString.current) {
          if (newQuery != null && lastQueryString.current === null) {
            // User just typed @, allow menu to open.
            // Also propagate the query immediately — we cannot rely on the
            // !isMentionMenuManuallyClosed branch below because state is still
            // true in the current closure render cycle (stale closure).
            setIsMentionMenuManuallyClosed(false);
            lastQueryString.current = newQuery;
            originalOnQueryChange(newQuery);
            return;
          }
          lastQueryString.current = newQuery;
        }

        // Only propagate query change if menu wasn't manually closed
        if (!isMentionMenuManuallyClosed) {
          originalOnQueryChange(newQuery);
        } else if (newQuery === null) {
          // Query ended (user deleted @), reset the flag
          setIsMentionMenuManuallyClosed(false);
          originalOnQueryChange(newQuery);
        }
      };
    },
    [isMentionMenuManuallyClosed],
  );

  const filterSuggestions = useCallback(
    <T>(suggestions: T[]): T[] => {
      return isMentionMenuManuallyClosed ? [] : suggestions;
    },
    [isMentionMenuManuallyClosed],
  );

  const closeMenu = useCallback(() => {
    setIsMentionMenuManuallyClosed(true);
    // Reset the last query so next @ starts fresh
    lastQueryString.current = null;
  }, []);

  return {
    createQueryChangeHandler,
    filterSuggestions,
    closeMenu,
    isMenuClosed: isMentionMenuManuallyClosed,
  };
};
