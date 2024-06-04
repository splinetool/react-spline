/// <reference types="react" />
import { Application } from '@splinetool/runtime';
import type { SPEObject, SplineEvent, SplineEventName } from '@splinetool/runtime';
export type { SPEObject, SplineEvent, SplineEventName };
export interface SplineProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onLoad' | 'onMouseDown' | 'onMouseUp' | 'onMouseHover' | 'onKeyDown' | 'onKeyUp' | 'onWheel'> {
    scene: string;
    onLoad?: (e: Application) => void;
    onMouseDown?: (e: SplineEvent) => void;
    onMouseUp?: (e: SplineEvent) => void;
    onMouseHover?: (e: SplineEvent) => void;
    onKeyDown?: (e: SplineEvent) => void;
    onKeyUp?: (e: SplineEvent) => void;
    onStart?: (e: SplineEvent) => void;
    onLookAt?: (e: SplineEvent) => void;
    onFollow?: (e: SplineEvent) => void;
    onWheel?: (e: SplineEvent) => void;
    renderOnDemand?: boolean;
}
declare const Spline: import("react").ForwardRefExoticComponent<SplineProps & import("react").RefAttributes<HTMLDivElement>>;
export default Spline;
