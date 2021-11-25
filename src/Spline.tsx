import { Application } from '@splinetool/runtime';
import './Spline.css';

import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
  CSSProperties,
} from 'react';

export type SplineEvent = {
  target: {
    name: string;
    id: string;
  };
};

export type SplineEventName =
  | 'mouseDown'
  | 'mouseUp'
  | 'mouseHover'
  | 'keyDown'
  | 'keyUp'
  | 'start'
  | 'lookAt'
  | 'follow';

export type SPEObject = {
  name: string;
  uuid: string;
  visible: boolean;
  intensity: number;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  /**
   * Triggers a Spline event.
   * Starts from firt state to last state.
   * @param {string} eventName String that matches Spline event's name
   * @param {string}	uuid String to match to the object's uuid
   */
  emitEvent: (eventName: SplineEventName) => void;
  /**
   * Triggers a Spline event in reverse order.
   * Starts from last state to first state.
   * @param {string} eventName String that matches Spline event's name
   */
  emitEventReverse: (eventName: SplineEventName) => void;
};

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
  /**
   *  Searches through scene's children and returns the object with that uuid
   * @param uuid	String to match to the object's uuid
   * @returns SPEOject
   */
  findObjectById: (uuid: string) => SPEObject | undefined;
  /**
   * Searches through scene's children and returns the first object with that name
   * @param  {string}	name String to match to the object's name
   * @returns SPEOject
   */
  findObjectByName: (name: string) => SPEObject | undefined;
  /**
   * Triggers a Spline event associated to an object with provided uuid.
   * Starts from first state to last state.
   * @param {string} eventName String that matches Spline event's name
   * @param {string} uuid String to match to the object's uuid
   */
  emitEvent: (eventName: SplineEventName, uuid: string) => void;
  /**
   * Triggers a Spline event associated to an object with provided uuid in reverse order.
   * Starts from last state to first state.
   * @param {string} eventName String that matches Spline event's name
   * @param {string}	uuid String to match to the object's uuid
   */
  emitEventReverse: (eventName: SplineEventName, uuid: string) => void;
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
        speApp = new Application(canvasRef.current, { autoRender: true });

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
            speApp.removeEventListener(event.name, event.cb);
          }
        }
        speApp.unmount();
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
