import { useContext, useLayoutEffect, useRef } from 'react';
import { ThemeContext } from '~/v4/core/providers/ThemeProvider';

// TODO: check with livestream moderation feature

/**
 * Hook to force dark theme for a component
 * Automatically restores the previous theme when the component unmounts
 * Keeps theme locked to dark even if toggled externally
 */
export function useForceDarkTheme() {
  const themeContext = useContext(ThemeContext);
  const previousTheme = useRef<'light' | 'dark' | null>(null);

  // Store original theme on mount and restore on unmount
  useLayoutEffect(() => {
    previousTheme.current = themeContext.currentTheme;

    return () => {
      // Restore previous theme when component unmounts
      if (previousTheme.current !== null && previousTheme.current !== 'dark') {
        themeContext.toggleTheme(previousTheme.current);
      }
    };
  }, []); // Empty deps - only on mount/unmount

  // Keep theme locked to dark whenever it changes
  useLayoutEffect(() => {
    if (themeContext.currentTheme !== 'dark') {
      themeContext.toggleTheme('dark');
    }
  }, [themeContext.currentTheme]);
}
