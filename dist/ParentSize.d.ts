/// <reference types="react" />
interface ResizeObserverPolyfill {
    new (callback: ResizeObserverCallback): ResizeObserver;
}
export type ParentSizeProps = {
    /** Optional `className` to add to the parent `div` wrapper used for size measurement. */
    className?: string;
    /** Child render updates upon resize are delayed until `debounceTime` milliseconds _after_ the last resize event is observed. */
    debounceTime?: number;
    /** Optional flag to toggle leading debounce calls. When set to true this will ensure that the component always renders immediately. (defaults to true) */
    enableDebounceLeadingCall?: boolean;
    /** Optional dimensions provided won't trigger a state change when changed. */
    ignoreDimensions?: keyof ParentSizeState | (keyof ParentSizeState)[];
    /** Optional `style` object to apply to the parent `div` wrapper used for size measurement. */
    parentSizeStyles?: React.CSSProperties;
    /** Optionally inject a ResizeObserver polyfill, else this *must* be globally available. */
    resizeObserverPolyfill?: ResizeObserverPolyfill;
    /** Child render function `({ width, height, top, left, ref, resize }) => ReactNode`. */
    children: (args: {
        ref: HTMLDivElement | null;
        resize: (state: ParentSizeState) => void;
    } & ParentSizeState) => React.ReactNode;
};
type ParentSizeState = {
    width: number;
    height: number;
    top: number;
    left: number;
};
export type ParentSizeProvidedProps = ParentSizeState;
declare const _default: import("react").ForwardRefExoticComponent<ParentSizeProps & import("react").RefAttributes<HTMLDivElement>>;
export default _default;
