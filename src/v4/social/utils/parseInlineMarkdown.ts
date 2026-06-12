export type InlineMarkdownSegment =
  | { type: 'text'; text: string }
  | { type: 'bold'; text: string }
  | { type: 'italic'; text: string }
  | { type: 'link'; label: string; url: string };

// Matches the three legacy-fork inline syntaxes: **bold**, *italic*, [label](url).
// Ordered alternation: **bold** is tried before *italic* so the double-asterisk wins.
// Inner content for emphasis excludes `*` and newlines to keep matches non-greedy and on one line.
// The italic alternation uses lookarounds so it does not eat the inner pair of a **bold** span.
const MARKDOWN_INLINE_REGEX =
  /\*\*([^*\n]+?)\*\*|(?<!\*)\*([^*\n]+?)\*(?!\*)|\[([^\]\n]+)\]\(([^)\s]+)\)/g;

export const parseInlineMarkdown = (input: string): InlineMarkdownSegment[] => {
  if (!input) return [];

  const segments: InlineMarkdownSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  MARKDOWN_INLINE_REGEX.lastIndex = 0;
  while ((match = MARKDOWN_INLINE_REGEX.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', text: input.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      segments.push({ type: 'bold', text: match[1] });
    } else if (match[2] !== undefined) {
      segments.push({ type: 'italic', text: match[2] });
    } else if (match[3] !== undefined && match[4] !== undefined) {
      segments.push({ type: 'link', label: match[3], url: match[4] });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < input.length) {
    segments.push({ type: 'text', text: input.slice(lastIndex) });
  }

  return segments;
};

export type MarkdownLinkSpan = { start: number; end: number };

/**
 * Full `[start, end)` spans of every `[label](url)` markdown link in the text.
 * Same pattern as the link alternation in MARKDOWN_INLINE_REGEX.
 */
export const markdownLinkSpans = (text: string): MarkdownLinkSpan[] => {
  const spans: MarkdownLinkSpan[] = [];
  const regex = /\[[^\]\n]+\]\([^)\s]+\)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    spans.push({ start: match.index, end: match.index + match[0].length });
  }
  return spans;
};

/**
 * Drops links whose span overlaps a `[label](url)` markdown link. Those render
 * as part of the markdown link (see parseInlineMarkdown), so carving them out
 * as standalone link nodes would split the markdown apart (leaving the literal
 * brackets visible) and could trigger a spurious link preview.
 */
export const stripMarkdownLinkUrls = (links: Amity.Link[], text: string): Amity.Link[] => {
  if (links.length === 0) return links;

  const spans = markdownLinkSpans(text);
  if (spans.length === 0) return links;

  return links.filter((link) => {
    if (link.index === undefined) return true;
    const start = link.index;
    const end = start + (link.length ?? link.url.length);
    return !spans.some((span) => start < span.end && end > span.start);
  });
};
