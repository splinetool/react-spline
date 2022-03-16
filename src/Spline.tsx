import { useEffect, useRef, useState, forwardRef, CSSProperties } from 'react';
import { Application } from '@splinetool/runtime';
import type {
  SPEObject,
  SplineEvent,
  SplineEventName,
} from '@splinetool/runtime';

export type { SPEObject, SplineEvent, SplineEventName };

export interface SplineProps {
  scene: string;
  id?: string;
  style?: CSSProperties;
  className?: string;
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
  autoRender?: boolean;
}

const Spline = forwardRef<HTMLDivElement, SplineProps>(
  (
    {
      scene,
      id,
      style,
      className,
      onMouseDown,
      onMouseUp,
      onMouseHover,
      onKeyDown,
      onKeyUp,
      onStart,
      onLookAt,
      onFollow,
      onWheel,
      onLoad,
      autoRender = false,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = useState(true);

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
          cb: onMouseDown,
        },
        {
          name: 'mouseUp',
          cb: onMouseUp,
        },
        {
          name: 'mouseHover',
          cb: onMouseHover,
        },
        {
          name: 'keyDown',
          cb: onKeyDown,
        },
        {
          name: 'keyUp',
          cb: onKeyUp,
        },
        {
          name: 'start',
          cb: onStart,
        },
        {
          name: 'lookAt',
          cb: onLookAt,
        },
        {
          name: 'follow',
          cb: onFollow,
        },
        {
          name: 'scroll',
          cb: onWheel,
        },
      ];

      if (canvasRef.current) {
        speApp = new Application(canvasRef.current, { autoRender });

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

        init();
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
      <div
        style={{
          display: `${isLoading ? 'none' : 'flex'}`,
          ...style,
        }}
        className={className}
        ref={ref}
      >
        <canvas ref={canvasRef} id={id} />
      </div>
    );
  }
);

export default Spline;
