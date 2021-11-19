import { Application, SplineEvent } from './runtime/runtime';

import './Spline.css';

import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
  CSSProperties,
} from 'react';

interface SplineProps {
  scene: string;
  id: string;
  responsive?: boolean;
  style?: CSSProperties;
  onLoad?: () => void;
  onMouseDown?: (e: SplineEvent) => void;
  onMouseUp?: (e: SplineEvent) => void;
  onMouseHover?: (e: SplineEvent) => void;
  onKeyDown?: (e: SplineEvent) => void;
  onKeyUp?: (e: SplineEvent) => void;
  onStart?: (e: SplineEvent) => void;
  onLookAt?: (e: SplineEvent) => void;
  onFollow?: (e: SplineEvent) => void;
}

export interface SplineRef {
  findObjectById: (uuid: string) => any;
  addEventListener: (eventName: string, cb: (e: any) => void) => void;
  emitEvent: (eventName: string, uuid: string) => void;
}

export const Spline = forwardRef<SplineRef, SplineProps>(
  (
    {
      scene,
      id,
      responsive,
      style,
      onMouseDown,
      onMouseUp,
      onMouseHover,
      onKeyDown,
      onKeyUp,
      onStart,
      onLookAt,
      onFollow,
      onLoad,
    },
    ref
  ) => {
    const [app, setApp] = useState<Application | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize runtime when component is mounted
    useEffect(() => {
      if (canvasRef.current) {
        const speApp = new Application(canvasRef.current);
        speApp.load(scene).then(() => {
          // Add event listeners
          if (onMouseDown) {
            speApp.addEventListener('mouseDown', onMouseDown);
          }
          if (onMouseUp) {
            speApp.addEventListener('mouseUp', onMouseUp);
          }
          if (onMouseHover) {
            speApp.addEventListener('mouseHover', onMouseHover);
          }
          if (onKeyDown) {
            speApp.addEventListener('keyDown', onKeyDown);
          }
          if (onKeyUp) {
            speApp.addEventListener('keyUp', onKeyUp);
          }
          if (onStart) {
            speApp.addEventListener('start', onStart);
          }
          if (onLookAt) {
            speApp.addEventListener('lookAt', onLookAt);
          }
          if (onFollow) {
            speApp.addEventListener('follow', onFollow);
          }

          console.log(speApp.getSplineEvents())

          setApp(speApp);
          setIsLoading(false);
          onLoad?.();
        });
      }

      return () => {
        if (onMouseDown) {
          app?.removeEventListener('mouseDown', onMouseDown);
        }
        if (onMouseUp) {
          app?.removeEventListener('mouseUp', onMouseUp);
        }
        if (onMouseHover) {
          app?.removeEventListener('mouseHover', onMouseHover);
        }
        if (onKeyDown) {
          app?.removeEventListener('keyDown', onKeyDown);
        }
        if (onKeyUp) {
          app?.removeEventListener('keyUp', onKeyUp);
        }
        if (onStart) {
          app?.removeEventListener('start', onStart);
        }
        if (onLookAt) {
          app?.removeEventListener('lookAt', onLookAt);
        }
        if (onFollow) {
          app?.removeEventListener('follow', onFollow);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Expose runtime api methods to parent component
    useImperativeHandle(ref, () => ({
      findObjectById: (uuid: string) => {
        return app?.findObjectById(uuid);
      },
      addEventListener: (eventName: string, cb: (e: any) => void) => {
        app?.addEventListener(eventName, cb);
      },
      emitEvent: (eventName: string, uuid: string) => {
        app?.emitEvent(eventName, uuid);
      },
    }));

    return (
      <div
        className={responsive ? 'spline-responsive' : ''}
        style={{ display: `${isLoading ? 'none' : 'flex'}`, ...style }}
      >
        <canvas ref={canvasRef} id={id} />
      </div>
    );
  }
);
