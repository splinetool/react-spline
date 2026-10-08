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

// A canvas's WebGL context outlives Application.dispose(), and a page only
// gets so many live contexts (about 16 in Chrome) before the browser drops
// the oldest one — another scene on the page, which then goes blank for
// good. So once a canvas is done with, its context is released. Deferred a
// tick: StrictMode, and a `scene` change, run the effect again straight away
// on the same canvas, and that run must find the context still alive.
const pendingRelease = new WeakMap<
  HTMLCanvasElement,
  ReturnType<typeof setTimeout>
>();

function releaseContextSoon(canvas: HTMLCanvasElement) {
  pendingRelease.set(
    canvas,
    setTimeout(() => {
      pendingRelease.delete(canvas);
      // a canvas holding a WebGPU context returns null for both
      const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    }, 0)
  );
}

function keepContext(canvas: HTMLCanvasElement) {
  const pending = pendingRelease.get(canvas);
  if (pending !== undefined) {
    clearTimeout(pending);
    pendingRelease.delete(canvas);
  }
}

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

      const canvas = canvasRef.current;
      if (canvas) {
        // the same canvas again (StrictMode, a new scene): keep its context
        keepContext(canvas);
        speApp = new Application(canvas, {
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
        if (canvas) releaseContextSoon(canvas);
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
