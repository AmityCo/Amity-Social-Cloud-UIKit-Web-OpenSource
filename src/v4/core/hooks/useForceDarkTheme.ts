import { useContext, useLayoutEffect, useRef } from 'react';
import { ThemeContext } from '~/v4/core/providers/ThemeProvider';

// TODO: check with livestream moderation feature

/**
 * Hook to force dark theme for a component
 * Automatically restores the previous theme when the component unmounts
 */
export function useForceDarkTheme() {
  const themeContext = useContext(ThemeContext);
  const previousTheme = useRef<'light' | 'dark'>(themeContext.currentTheme);
  const hasSetTheme = useRef(false);

  useLayoutEffect(() => {
    // Only set theme once on mount
    if (!hasSetTheme.current) {
      previousTheme.current = themeContext.currentTheme;
      hasSetTheme.current = true;

      // Force to dark theme when component mounts
      if (themeContext.currentTheme !== 'dark') {
        themeContext.toggleTheme();
      }
    }

    // Restore previous theme when component unmounts
    return () => {
      if (previousTheme.current !== 'dark') {
        themeContext.toggleTheme();
      }
    };
  }, []); // Empty deps - only run on mount/unmount
}
