'use client';
import { useEffect, useRef, useState, forwardRef } from 'react';
import { Application } from '@splinetool/runtime';
import type {
  SPEObject,
  SplineEvent,
  SplineEventName,
} from '@splinetool/runtime';
import ParentSize from './ParentSize';

export type { SPEObject, SplineEvent, SplineEventName };

export interface SplineProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onLoad'> {
  scene: string;
  onLoad?: (e: Application) => void;
  onSplineMouseDown?: (e: SplineEvent) => void;
  onSplineMouseUp?: (e: SplineEvent) => void;
  onSplineMouseHover?: (e: SplineEvent) => void;
  onSplineKeyDown?: (e: SplineEvent) => void;
  onSplineKeyUp?: (e: SplineEvent) => void;
  onSplineStart?: (e: SplineEvent) => void;
  onSplineLookAt?: (e: SplineEvent) => void;
  onSplineFollow?: (e: SplineEvent) => void;
  onSplineScroll?: (e: SplineEvent) => void;
  renderOnDemand?: boolean;
  wasmPath?: string; // Optional path to the wasm file
}

const Spline = forwardRef<HTMLDivElement, SplineProps>(
  (
    {
      scene,
      style,
      onSplineMouseDown,
      onSplineMouseUp,
      onSplineMouseHover,
      onSplineKeyDown,
      onSplineKeyUp,
      onSplineStart,
      onSplineLookAt,
      onSplineFollow,
      onSplineScroll,
      onLoad,
      renderOnDemand = true,
      wasmPath,
      children,
      ...props
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error>();

    // We throw the error so ErrorBoundary can catch it
    if (error) {
      throw error;
    }

    // Initialize runtime when component is mounted
    useEffect(() => {
      setIsLoading(true);

      let speApp: Application;
      const events: {
        name: SplineEventName;
        cb?: (e: SplineEvent) => void;
      }[] = [
        {
          name: 'mouseDown',
          cb: onSplineMouseDown,
        },
        {
          name: 'mouseUp',
          cb: onSplineMouseUp,
        },
        {
          name: 'mouseHover',
          cb: onSplineMouseHover,
        },
        {
          name: 'keyDown',
          cb: onSplineKeyDown,
        },
        {
          name: 'keyUp',
          cb: onSplineKeyUp,
        },
        {
          name: 'start',
          cb: onSplineStart,
        },
        {
          name: 'lookAt',
          cb: onSplineLookAt,
        },
        {
          name: 'follow',
          cb: onSplineFollow,
        },
        {
          name: 'scroll',
          cb: onSplineScroll,
        },
      ];

      if (canvasRef.current) {
        speApp = new Application(canvasRef.current, {
          renderOnDemand,
          wasmPath,
        });

        async function init() {
          await speApp.load(scene);

          for (let event of events) {
            if (event.cb) {
              speApp.addEventListener(event.name, event.cb);
            }
          }

          setIsLoading(false);
          onLoad?.(speApp);
        }

        init().catch((err) => {
          setError(err as Error);
        });
      }

      return () => {
        for (let event of events) {
          if (event.cb) {
            speApp.removeEventListener(event.name, event.cb);
          }
        }
        speApp.dispose();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scene]);

    return (
      <ParentSize
        ref={ref}
        parentSizeStyles={{ overflow: 'hidden', ...style }}
        debounceTime={50}
        {...props}
      >
        {() => (
          <>
            {isLoading && children}
            <canvas
              ref={canvasRef}
              style={{
                display: isLoading ? 'none' : 'block',
              }}
            />
          </>
        )}
      </ParentSize>
    );
  }
);

export default Spline;
