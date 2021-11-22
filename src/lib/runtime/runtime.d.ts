export declare type SPEObject = {
  [key: string]: any;
  emitEvent: (eventName: keyof InteractionCache) => void;
};

export declare type SplineEvent = {
  target: {
    name: string;
    id: string;
  };
};

export declare class Application {
  canvas: HTMLCanvasElement;
  constructor(canvas?: HTMLCanvasElement);
  load(path: string): Promise<void>;
  start(json: JSON): Promise<void>;
  deactivate(): void;
  findObjectById(uuid: string): SPEObject | undefined;
  findObjectByName(name: string): SPEObject | undefined;
  getSplineEvents(): {
    [key: string]: CustomEvent<any>;
  };
  emitEvent(eventName: keyof InteractionCache, uuid: string): void;
  emitEventReverse(eventName: keyof InteractionCache, uuid: string): void;
  dispatchEvent(event: Event): void;
  addEventListener(
    eventName: keyof InteractionCache,
    cb: (e: SplineEvent) => void
  ): void;
  removeEventListener(
    eventName: keyof InteractionCache,
    cb: (e: SplineEvent) => void
  ): void;
}
export {};
