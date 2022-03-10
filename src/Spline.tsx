import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
  CSSProperties,
} from 'react';
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
  onLoad?: () => void;
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
  /**
   * Sets the zoom of the scene.
   * @param {number} zoomValue The new value of the zoom.
   */
  setZoom: (zoomValue: number) => void;
}

export const Spline = forwardRef<SplineRef, SplineProps>(
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
        {
          name: 'scroll',
          cb: onWheel,
        },
      ];

      if (canvasRef.current) {
        speApp = new Application(canvasRef.current, { autoRender });

        const init = async function () {
          const response = await fetch(scene);
          const buffer = await response.arrayBuffer();
          await speApp.start(buffer);

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
        speApp.dispose();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scene]);

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
          setZoom(zoomValue: number) {
            // TEMP use zoom out until we have proper zooming API
            appRef.current.app?._controls.zoomOut(zoomValue);
          },
        };
      },
      []
    );

    return (
      <div
        style={{
          display: `${isLoading ? 'none' : 'flex'}`,
          ...style,
        }}
        className={className}
      >
        <canvas ref={canvasRef} id={id} />
      </div>
    );
  }
);
