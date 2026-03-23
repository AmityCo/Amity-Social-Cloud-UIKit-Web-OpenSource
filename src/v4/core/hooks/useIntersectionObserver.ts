import { useEffect } from 'react';

function getScrollParent(element: HTMLElement): HTMLElement | null {
  let parent = element.parentElement;
  while (parent) {
    const style = getComputedStyle(parent);
    const overflowY = style.overflowY;
    if (overflowY === 'scroll' || overflowY === 'auto') {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}

const useIntersectionObserver = ({
  node,
  onIntersect,
  onLeave,
  options,
}: {
  node?: HTMLElement | null;
  onIntersect: () => void;
  onLeave?: () => void;
  options?: IntersectionObserverInit;
}) => {
  useEffect(() => {
    if (node == null) return;

    const resolvedOptions = options ?? {};

    // If no root is specified, find the nearest scrollable ancestor
    if (!resolvedOptions.root) {
      const scrollParent = getScrollParent(node);
      if (scrollParent) {
        resolvedOptions.root = scrollParent;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && onIntersect(),
      resolvedOptions,
    );
    observer.observe(node);

    return () => observer.disconnect();
  }, [node, onIntersect, options, onLeave]);
};

export default useIntersectionObserver;
