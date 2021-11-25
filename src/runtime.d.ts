declare module '@splinetool/runtime' {
  export type SPEObject = {
    name: string;
    uuid: string;
    visible: boolean;
    intensity: number;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
    emitEvent: (eventName: SplineEventName) => void;
    emitEventReverse: (eventName: SplineEventName) => void;
  };

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

  export class Application {
    canvas: HTMLCanvasElement;
    constructor(canvas?: HTMLCanvasElement, options?: { autoRender?: boolean });
    load(path: string): Promise<void>;
    start(json: any): Promise<void>;
    /**
     *  Searches through scene's children and returns the object with that uuid
     * @param uuid	String to match to the object's uuid
     * @returns SPEObject
     */
    findObjectById(uuid: string): SPEObject | undefined;
    /**
     * Searches through scene's children and returns the first object with that name
     * @param  {string}	name
     * @returns {Object} SPEObject
     */
    findObjectByName(name: string): SPEObject | undefined;
    /**
     * Returns an array of Spline events
     * @returns {Array.<Object>}
     */
    getSplineEvents(): {
      [key: string]: {
        [key: string]: CustomEvent<any>;
      };
    };
    /**
     * Triggers a Spline event associated to an object with provided uuid.
     * Starts from first state to last state.
     * @param {string} eventName String that matches Spline event's name
     * @param {string} uuid
     */
    emitEvent(eventName: SplineEventName, uuid: string): void;
    /**
     * Triggers a Spline event associated to an object with provided uuid in reverse order.
     * Starts from last state to first state.
     * @param {string} eventName String that matches Spline event's name
     * @param {string}	uuid
     */
    emitEventReverse(eventName: SplineEventName, uuid: string): void;
    /**
     * Add an event listener for Spline events
     * @param {string} eventName String that matches Spline event's name
     * @param {function} cb	A callback function with Spline event as parameter
     */
    addEventListener(
      eventName: SplineEventName,
      cb: (e: SplineEvent) => void
    ): void;
    /**
     * Removes the event listener for a Spline event with the same name and callback
     * @param {string} eventName String that matches Spline event's name
     * @param {function} cb	A callback function with Spline event as parameter
     */
    removeEventListener(
      eventName: SplineEventName,
      cb: (e: SplineEvent) => void
    ): void;
    /**
     * Deactivates runtime
     */
    unmount(): void;
  }
}
