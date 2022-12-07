//TODO: Replace with chakra Highlight once WAX is updated to chakra v2
import React, { Fragment, useMemo } from 'react';
import { useStyleConfig, Box, StyleProps, BoxProps } from '@noom/wax-component-library';

type Chunk = {
  text: string;
  match: boolean;
};

type Options = {
  text: string;
  query: string | string[];
  allowDuplicate?: boolean;
};

const escapeRegexp = (term: string): string =>
  term.replace(/[|\\{}()[\]^$+*?.-]/g, (char: string) => `\\${char}`);

function buildRegex(query: string[]) {
  const _query = query.filter((text) => text.length !== 0).map((text) => escapeRegexp(text.trim()));
  if (!_query.length) {
    return null;
  }

  return new RegExp(`(${_query.join('|')})`, 'i');
}

function highlightWords({ text, query, allowDuplicate }: Options): Chunk[] {
  const regex = buildRegex(Array.isArray(query) ? query : [query]);
  if (!regex) {
    return [{ text, match: false }];
  }
  const result = text.split(regex).filter(Boolean);
  return result.map((str, index, array) => ({
    text: str,
    match: regex.test(str) && (allowDuplicate ? true : array.findIndex((v) => v === str) === index),
  }));
}

export function useHighlight(props: Options) {
  const { text, query, allowDuplicate } = props;
  return useMemo(() => highlightWords({ text, query, allowDuplicate }), [text, query]);
}

export type HighlightProps = {
  query: string | string[];
  children: string | ((props: Chunk[]) => React.ReactNode);
  allowDuplicate?: boolean;
  styles?: StyleProps;
};

export type MarkProps = BoxProps;

export const Mark = (props: MarkProps) => {
  const styles = useStyleConfig('Box', props);
  return (
    <Box {...props} as="mark" __css={{ bg: 'transparent', whiteSpace: 'nowrap', ...styles }} />
  );
};

/**
 * `Highlight` allows you to highlight substrings of a text.
 *
 * @see Docs https://chakra-ui.com/docs/components/highlight
 */
export function Highlight(props: HighlightProps): JSX.Element {
  const { children, query, styles, allowDuplicate } = props;

  if (typeof children !== 'string') {
    throw new Error('The children prop of Highlight must be a string');
  }

  const chunks = useHighlight({ query, text: children, allowDuplicate });

  return (
    <>
      {chunks.map((chunk, index) => {
        return chunk.match ? (
          <Mark key={index} sx={styles}>
            {chunk.text}
          </Mark>
        ) : (
          <Fragment key={index}>{chunk.text}</Fragment>
        );
      })}
    </>
  );
}
