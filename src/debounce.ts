type DebouncedFunction<T extends (...args: any[]) => void> = T & {
  cancel: () => void;
};

/**
 * Lightweight debounce utility replacing lodash.debounce.
 *
 * Supports:
 *   - Trailing-only (default): fires after `delay` ms of inactivity
 *   - Leading+trailing: fires immediately on first call, then once more
 *     on trailing edge if additional calls occurred during the delay
 *   - cancel(): clears pending invocation and resets all state
 *
 * NOT supported (not needed by ParentSize):
 *   - { trailing: false } option
 *   - maxWait
 *   - flush() / pending()
 */
export default function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
  { leading = false }: { leading?: boolean } = {}
): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let isLeadingInvoked = false;
  let lastThis: unknown;
  let lastArgs: Parameters<T> | undefined;

  const debounced = function (this: unknown, ...args: Parameters<T>) {
    lastThis = this;
    lastArgs = args;

    if (leading && !isLeadingInvoked) {
      isLeadingInvoked = true;
      fn.apply(this, args);
      lastArgs = undefined; // Clear so we can detect subsequent calls
    }

    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      const thisCtx = lastThis;
      const thisArgs = lastArgs;
      // Reset state BEFORE calling fn so re-entrant calls work correctly
      isLeadingInvoked = false;
      timeoutId = undefined;
      lastArgs = undefined;

      if (!leading && thisArgs !== undefined) {
        fn.apply(thisCtx, thisArgs);
      } else if (thisArgs !== undefined) {
        // Leading+trailing: only fire trailing if there were calls after the leading
        fn.apply(thisCtx, thisArgs);
      }
    }, delay);
  } as DebouncedFunction<T>;

  debounced.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = undefined;
    isLeadingInvoked = false;
    lastArgs = undefined;
    lastThis = undefined;
  };

  return debounced;
}
