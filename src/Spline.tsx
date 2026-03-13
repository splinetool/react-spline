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
  /**
   * Optional ref to persist the Application instance across mount/unmount cycles.
   * When provided, the component will skip Spline Application dispose() on unmount and reuse the
   * existing Application (and its canvas/WebGL context) on remount, avoiding
   * scene reloads on SPA route navigation. Note that it will be the consumer's responsibility to manage the lifecycle of the Application in this case, including manual dispose when needed.
   */
  applicationRef?: React.MutableRefObject<Application | null>;
}

const applicationSceneMap = new WeakMap<Application, string>();

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
      applicationRef,
      children,
      ...props
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error>();

    // We throw the error so ErrorBoundary can catch it
    if (error) {
      throw error;
    }

    // Initialize runtime when component is mounted
    useEffect(() => {
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

      // Reuse a persisted Application if available
      const existingApp = applicationRef?.current;
      const canReuseExistingApp =
        existingApp && applicationSceneMap.get(existingApp) === scene;

      if (existingApp && !canReuseExistingApp) {
        existingApp.dispose();
        applicationRef.current = null;
      }

      if (canReuseExistingApp && containerRef.current) {
        // Re-attach the original canvas into the new container
        const canvas = existingApp.canvas;
        canvas.style.display = 'block';
        containerRef.current.replaceChildren(canvas);
        for (let event of events) {
          if (event.cb) {
            existingApp.addEventListener(event.name, event.cb);
          }
        }
        
        setIsLoading(false);
        Promise.resolve().then(() => onLoad?.(existingApp));
        existingApp.play();

        return () => {
          for (let event of events) {
            if (event.cb) {
              existingApp.removeEventListener(event.name, event.cb);
            }
          }
          // Don't dispose — keep the Application alive for next remount
          existingApp.stop();
        };
      }

      // Fresh initialization
      setIsLoading(true);

      let speApp: Application;

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

          if (applicationRef) {
            applicationSceneMap.set(speApp, scene);
            applicationRef.current = speApp;
          }

          setIsLoading(false);
          onLoad?.(speApp);
        }

        init().catch((err) => {
          setError(err as Error);
        });
      }

      return () => {
        if (!speApp) return;
        for (const event of events) {
          if (event.cb) {
            speApp.removeEventListener(event.name, event.cb);
          }
        }
        if (applicationRef) {
          // Don't dispose — keep the Application alive for next remount
          speApp.stop();
        } else {
          speApp.dispose();
        }
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
            {applicationRef ? (
              <div
                ref={containerRef}
                style={{ display: isLoading ? 'none' : 'contents' }}
              >
                <canvas
                  ref={canvasRef}
                  style={{
                    display: isLoading ? 'none' : 'block',
                  }}
                />
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                style={{
                  display: isLoading ? 'none' : 'block',
                }}
              />
            )}
          </>
        )}
      </ParentSize>
    );
  }
);

export default Spline;
