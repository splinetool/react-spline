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
        options: AddEventListenerOptions;
      }[] = [
        {
          name: 'mouseDown',
          cb: onSplineMouseDown,
          options: {},
        },
        {
          name: 'mouseUp',
          cb: onSplineMouseUp,
          options: {},
        },
        {
          name: 'mouseHover',
          cb: onSplineMouseHover,
          options: {},
        },
        {
          name: 'keyDown',
          cb: onSplineKeyDown,
          options: {},
        },
        {
          name: 'keyUp',
          cb: onSplineKeyUp,
          options: {},
        },
        {
          name: 'start',
          cb: onSplineStart,
          options: {},
        },
        {
          name: 'lookAt',
          cb: onSplineLookAt,
          options: { passive: true },
        },
        {
          name: 'follow',
          cb: onSplineFollow,
          options: { passive: true },
        },
        {
          name: 'scroll',
          cb: onSplineScroll,
          options: { passive: true },
        },
      ];

      if (canvasRef.current) {
        speApp = new Application(canvasRef.current, { renderOnDemand });

        async function init() {
          await speApp.load(scene);

          for (let event of events) {
            if (event.cb) {
              // @ts-expect-error: @splinetool/runtime doesn't have types for addEventListener options
              speApp.addEventListener(event.name, event.cb, event.options);
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
            // @ts-expect-error: @splinetool/runtime doesn't have types for addEventListener options
            speApp.removeEventListener(event.name, event.cb, event.options);
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
