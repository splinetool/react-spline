import { Application, SplineEvent, SplineEventName } from './runtime/runtime';
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
  findObjectById: Application['findObjectById'];
  findObjectByName: Application['findObjectByName'];
  emitEvent: Application['emitEvent'];
  emitEventReverse: Application['emitEventReverse'];
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
    const appRef = useRef<{ app: Application | null }>({ app: null });
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
      ];

      if (canvasRef.current) {
        speApp = new Application(canvasRef.current, true);

        const init = async function () {
          const response = await fetch(scene);
          const json = await response.json();
          await speApp.start(json);

          for (let event of events) {
            if (event.cb) {
              speApp.addEventListener(event.name, event.cb);
            }
          }

          appRef.current.app = speApp;
          setIsLoading(false);
          onLoad?.();
        };

        init();
      }

      return () => {
        for (let event of events) {
          if (event.cb) {
            speApp?.removeEventListener(event.name, event.cb);
          }
        }
        speApp?.unmount();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Expose runtime api methods to parent component
    useImperativeHandle(
      ref,
      () => {
        return {
          findObjectById(uuid: string) {
            return appRef.current.app?.findObjectById(uuid);
          },
          findObjectByName(name: string) {
            return appRef.current.app?.findObjectByName(name);
          },
          emitEvent(eventName: SplineEventName, uuid: string) {
            appRef.current.app?.emitEvent(eventName, uuid);
          },
          emitEventReverse(eventName: SplineEventName, uuid: string) {
            appRef.current.app?.emitEventReverse(eventName, uuid);
          },
        };
      },
      []
    );

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
