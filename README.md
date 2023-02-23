[![](https://raw.githubusercontent.com/splinetool/react-spline/main/.github/screenshots/hero.png)](https://my.spline.design/splinereactlogocopycopy-eaa074bf6b2cc82d870c96e262a625ae/)

# react-spline

**react-spline** allows you to export and use Spline scenes directly in your React websites.

🌈 [Spline](https://spline.design/) is a friendly 3d collaborative design tool for the web.

[Website](https://spline.design/) &mdash;
[Twitter](https://twitter.com/splinetool) &mdash;
[Community](https://discord.gg/M9hNDMqvnw) &mdash;
[Documentation](https://docs.spline.design/)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
  - [Read and modify Spline objects](#read-and-modify-spline-objects)
  - [Listen to events](#listen-to-events)
  - [Trigger Spline events from outside](#trigger-spline-events-from-outside)
  - [Lazy loading](#lazy-loading)
- [API](#api)
  - [Spline Component Props](#spline-component-props)
  - [Spline App Methods](#spline-app-methods)
  - [Spline Events](#spline-events)
- [Contributing](#contributing)

## Install

```bash
yarn add @splinetool/react-spline @splinetool/runtime
```

or

```bash
npm install @splinetool/react-spline @splinetool/runtime
```

## Usage

To use react-spline, first you have to go to the Spline editor, click on the **Export** button, select "**Code**" and then "**React**".

You should see this:

<img width="250" src="https://raw.githubusercontent.com/splinetool/react-spline/main/.github/screenshots/react-export-pane.png">

You can copy the URL and pass it to the `<Spline />` component in react:

```jsx
import Spline from '@splinetool/react-spline';

export default function App() {
  return (
    <div>
      <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
    </div>
  );
}
```

You should be able to see the scene you exported in your React app.

[![](https://raw.githubusercontent.com/splinetool/react-spline/main/.github/screenshots/example-basic.png)](https://codesandbox.io/s/sweet-rain-28pcxt?file=/src/App.js)

### Read and modify Spline objects

You can query any Spline object via `findObjectByName` or `findObjectById`.

_(You can get the ID of the object in the `Develop` pane of the right sidebar)._

```jsx
import { useRef } from 'react';
import Spline from '@splinetool/react-spline';

export default function App() {
  const cube = useRef();

  function onLoad(spline) {
    const obj = spline.findObjectByName('Cube');
    // or
    // const obj = spline.findObjectById('8E8C2DDD-18B6-4C54-861D-7ED2519DE20E');

    // save it in a ref for later use
    cube.current = obj;
  }

  function moveObj() {
    console.log(cube.current); // Spline Object => { name: 'Cube', id: '8E8C2DDD-18B6-4C54-861D-7ED2519DE20E', position: {}, ... }

    // move the object in 3D space
    cube.current.position.x += 10;
  }

  return (
    <div>
      <Spline
        scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
        onLoad={onLoad}
      />
      <button type="button" onClick={moveObj}>
        Move Cube
      </button>
    </div>
  );
}
```

### Listen to events

You can listen to any Spline Event you set in the Events panel of the editor by attaching a listener to the Spline component.

```jsx
import Spline from '@splinetool/react-spline';

export default function App() {
  function onMouseDown(e) {
    if (e.target.name === 'Cube') {
      console.log('I have been clicked!');
    }
  }

  return (
    <div>
      <Spline
        scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
        onMouseDown={onMouseDown}
      />
    </div>
  );
}
```

You can find a list of all of the Spline Event listeners in the [Spline Component Props](#spline-component-props) section.

### Trigger Spline events from outside

You can trigger any animation Event you set in the Events panel in the Spline Editor.

You can use the `emitEvent` function via the spline ref, passing the [event type](#spline-events) and the ID of your object.

_(You can get the ID of the object in the `Develop` pane of the right sidebar)._

```jsx
import { useRef } from 'react';
import Spline from '@splinetool/react-spline';

export default function App() {
  const spline = useRef();

  function onLoad(splineApp) {
    // save the app in a ref for later use
    spline.current = splineApp;
  }

  function triggerAnimation() {
    spline.current.emitEvent('mouseHover', 'Cube');
  }

  return (
    <div>
      <Spline
        scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
        onLoad={onLoad}
      />
      <button type="button" onClick={triggerAnimation}>
        Trigger Spline Animation
      </button>
    </div>
  );
}
```

Or you can query the spline object first, and then trigger the event:

```jsx
import { useRef } from 'react';
import Spline from '@splinetool/react-spline';

export default function App() {
  const objectToAnimate = useRef();

  function onLoad(spline) {
    const obj = spline.findObjectByName('Cube');
    // save the object in a ref for later use
    objectToAnimate.current = obj;
  }

  function triggerAnimation() {
    objectToAnimate.current.emitEvent('mouseHover');
  }

  return (
    <div>
      <Spline
        scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
        onLoad={onLoad}
      />
      <button type="button" onClick={triggerAnimation}>
        Trigger Spline Animation
      </button>
    </div>
  );
}
```

You can find a list of all of the Spline Events you can pass to the `emitEvent` function in the [Spline Events](#spline-events) section.

### Lazy loading

To start loading react-spline after the whole website has finished loading, we can use lazy-loading. This technique can be achieved using [`React.lazy()`](https://it.reactjs.org/docs/code-splitting.html#reactlazy) in combination with dynamic imports:

```jsx
import React, { Suspense } from 'react';

const Spline = React.lazy(() => import('@splinetool/react-spline'));

export default function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
      </Suspense>
    </div>
  );
}
```

More info in the [relative React documentation](https://it.reactjs.org/docs/code-splitting.html).

## API

### Spline Component Props

These are all the props you can pass to the `<Spline />` component.

| Name              | Type                            | Description                                                                                                                   |
| ----------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `scene`           | `string`                        | Scene file                                                                                                                    |
| `onLoad?`         | `(spline: Application) => void` | Gets called once the scene has loaded. The `spline` parameter is an instance of the [Spline Application](#spline-app-methods) |
| `renderOnDemand?` | `boolean`                       | Wether or not to enable [on demand rendering](https://threejs.org/manual/#en/rendering-on-demand). Default `true`.            |
| `className?`      | `string`                        | CSS classes                                                                                                                   |
| `style?`          | `object`                        | CSS style                                                                                                                     |
| `id?`             | `string`                        | Canvas id                                                                                                                     |
| `ref?`            | `React.Ref<HTMLDivElement>`     | A ref pointing to div container element.                                                                                      |
| `onWheel?`        | `(e: SplineEvent) => void`      | Gets called on the [`wheel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event) event on the canvas        |
| `onMouseDown?`    | `(e: SplineEvent) => void`      | Gets called once a Spline `Mouse Down` event is fired                                                                         |
| `onMouseHover?`   | `(e: SplineEvent) => void`      | Gets called once a Spline `Mouse Hover` event is fired                                                                        |
| `onMouseUp?`      | `(e: SplineEvent) => void`      | Gets called once a Spline `Mouse Up` event is fired                                                                           |
| `onKeyDown?`      | `(e: SplineEvent) => void`      | Gets called once a Spline `Key Down` event is fired                                                                           |
| `onKeyUp?`        | `(e: SplineEvent) => void`      | Gets called once a Spline `Key Up` event is fired                                                                             |
| `onStart?`        | `(e: SplineEvent) => void`      | Gets called once a Spline `Start` event is fired                                                                              |
| `onLookAt?`       | `(e: SplineEvent) => void`      | Gets called once a Spline `Look At` event is fired                                                                            |
| `onFollow?`       | `(e: SplineEvent) => void`      | Gets called once a Spline `Mouse Up` event is fired                                                                           |

### Spline App Methods

The object exposed as a first argument of the `onLoad` function, is a Spline Application. You can call all these different methods on it.

| Name               | Type                                                       | Description                                                                                                                 |
| ------------------ | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `emitEvent`        | `(eventName: SplineEventName, nameOrUuid: string) => void` | Triggers a Spline event associated to an object with provided name or uuid.                                                 |
| `emitEventReverse` | `(eventName: SplineEventName, nameOrUuid: string) => void` | Triggers a Spline event associated to an object with provided uuid in reverse order. Starts from last state to first state. |
| `findObjectById`   | `(uuid: string) => SPEObject`                              | Searches through scene's children and returns the object with that uuid.                                                    |
| `findObjectByName` | `(name: string) => SPEObject`                              | Searches through scene's children and returns the first object with that name.                                              |
| `setZoom`          | `(zoom: number) => void`                                   | Sets the initial zoom of the scene.                                                                                         |

### Spline Events

These are all the Spline event types that you can pass to the `emitEvent` or `emitEventReverse` function.

| Name         | Description                                   |
| ------------ | --------------------------------------------- |
| `mouseDown`  | Refers to the Spline `Mouse Down` event type  |
| `mouseHover` | Refers to the Spline `Mouse Hover` event type |
| `mouseUp`    | Refers to the Spline `Mouse Up` event type    |
| `keyDown`    | Refers to the Spline `Key Down` event type    |
| `keyUp`      | Refers to the Spline `Key Up` event type      |
| `start`      | Refers to the Spline `Start` event type       |
| `lookAt`     | Refers to the Spline `Look At` event type     |
| `follow`     | Refers to the Spline `Mouse Up` event type    |

## Contributing

We use [yarn](https://yarnpkg.com/), install the dependencies like this:

```bash
yarn
```

### Development

Serve the `example` folder at localhost:3000

```bash
yarn dev
```

### Build Library

```bash
yarn build
```

### Publish on npm

```bash
yarn publish
```
