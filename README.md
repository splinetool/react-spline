# react-spline

🌈 [Spline](https://spline.design/) is a friendly 3d collaborative design tool for the web.

**react-spline** allows you to export and use spline scenes directly in your React websites.

## Table of Contents

- [Install](#install)
- [Usage](#usage)

  - [Generate scene link](#generate-scene-link)
  - [Start using react-spline component in React](#start-using-react-spline-component-in-react)
  - [Start using react-spline component in Next.js](#start-using-react-spline-component-in-nextjs)
  - [Listen to react-spline events](#listen-to-react-spline-events)
  - [Trigger scene events from outside](#trigger-scene-events-from-outside)
  - [Read and modify spline objects](#read-and-modify-spline-objects)

- [API](#api)
  - [Spline Props](#spline-props)
  - [Spline Container Ref Methods](#spline-container-ref-methods)
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

To use react-spline, first you have to go to the Spline editor, click on the Export button and select "**React Component**".

Spline generates links for Development (Drafts) and Production.

Drafts are generated each time you press on "**Generate Draft**". This will create a new link with the current content of the scene. All previous drafts are stored under the "**Drafts**" tab.

You can use the drafts to try ideas, and once you are ready, you can **promote your drafts to production**.

<img src="./.github/screenshots/react-export-pane.png" width="250">

Once you have a draft or production URL, you can start using the react-spline component in React.

```jsx
import { Spline } from '@splinetool/react-spline';

function App() {
  return (
    <main>
      <Spline scene="[DRAFT OR PROD URL]" />
    </main>
  );
}
```

### Listen to events

You can listen to any common event on the Spline canvas just by attaching a listener to the Spline component.

```jsx
import { Spline } from '@splinetool/react-spline';

function App() {
  function handleMouseDown(e) {
    if (e.target.id === 'my-object-id') {
      doSomething();
    }
  }

  return (
    <main>
      <Spline scene="[DRAFT OR PROD URL]" onMouseDown={handleMouseDown} />
    </main>
  );
}
```

### Read and modify Spline objects

You can query any Spline object via `findObjectById` or `findObjectByName`.

_(You can get the ID of the object in the `Develop` pane of the right sidebar)._

```jsx
import { Spline } from '@splinetool/react-spline'

function App() {
  const splineRef = useRef()
  const [myObj, setMyObj] = useState(null)

  useEffect(() => {
    const obj = splineRef.current.findObjectById('my-object-id')
    // or
    // const obj = splineRef.current.findObjectByName('my object')

    setMyObj(obj)
  }, [splineRef.current])

  function moveObj() {
    console.log(myObj) // Spline Object => { name: 'my object', id: '8E8C2DDD-18B6-4C54-861D-7ED2519DE20E', position: {}, ... }

    // move the object in 3D space
    myObj.position.x += 10
  }

  return (
    <main>
      <Spline ref={splineRef} scene="[DRAFT OR PROD URL]"/>
      <button type="button" onClick={moveObj}/>
        Move {myObj.name}
      </button>
    </main>
  )
}
```

**NOTE**: if you're using [Next.js](https://nextjs.org/), to be albe to use the `ref`, you have to wrap `<Spline />` in a component and load it with [next/dynamic](https://nextjs.org/docs/advanced-features/dynamic-import).

<details>
<summary>See Next.js usage example</summary>

1. Create a wrapped component.

   ```jsx
   import { Spline } from '@splinetool/react-spline';

   export function WrappedSpline({ splineRef, ...props }) {
     return <Spline ref={splineRef} {...props} />;
   }
   ```

2. Use [next/dynamic](https://nextjs.org/docs/advanced-features/dynamic-import) to import client-side component.

   ```jsx
   import dynamic from 'next/dynamic';

   const WrappedSpline = dynamic(
     () => import('./WrappedSpline').then((mod) => mod.WrappedSpline),
     {
       ssr: false,
     }
   );

   const Spline = forwardRef((props, ref) => {
     return <WrappedSpline {...props} splineRef={ref} />;
   });

   function App() {
     const splineRef = useRef();

     useEffect(() => {
       // you can access splineRef.current here
     }, [splineRef.current]);

     return (
       <main>
         <Spline scene="[DRAFT OR PROD URL]" ref={splineRef} />
       </main>
     );
   }
   ```

</details>

### Trigger Spline events from outside

You can trigger any animation Event you set in the Events panel in the Spline Editor.

You can use the `emitEvent` function via the spline ref, passing the event type and the ID of your object.

_(You can get the ID of the object in the `Develop` pane of the right sidebar)._

```jsx
import { Spline } from '@splinetool/react-spline'

function App() {
  const splineRef = useRef()

  function triggerAnimation() {
    const spline = splineRef.current
    spline.emitEvent('mouseHover', 'my-object-id')
  }

  return (
    <main>
      <Spline ref={splineRef} scene="[DRAFT OR PROD URL]"/>
      <button type="button" onClick={triggerAnimation}/>
        Trigger Spline Animation
      </button>
    </main>
  )
}

```

Or you can query the spline object first, and then trigger the event:

```jsx
import { Spline } from '@splinetool/react-spline'

function App() {
  const splineRef = useRef()
  const [objectToAnimate, setObjectToAnimate] = useState(null)

  // once loaded, get the object with id: 'my-object-id'
  useEffect(() => {
    const spline = splineRef.current

    const obj = spline.findObjectById('my-object-id')
    setObjectToAnimate(obj)
  }, [splineRef.current])

  function triggerAnimation() {
    objectToAnimate.emitEvent('mouseHover')
  }

  return (
    <main>
      <Spline ref={splineRef} scene="[DRAFT OR PROD URL]"/>
      <button type="button" onClick={triggerAnimation}/>
        Trigger Spline Animation
      </button>
    </main>
  )
}
```

## API

### Spline Component Props

| Name            | Type                       | Description                             |
| --------------- | -------------------------- | --------------------------------------- |
| `scene`         | `string`                   | Scene file                              |
| `className?`    | `string`                   | CSS classes                             |
| `style?`        | `string`                   | CSS style                               |
| `id?`           | `string`                   | Canvas id                               |
| `onMouseDown?`  | `(e: SplineEvent) => void` | Function handler for Mouse Down events  |
| `onMouseHover?` | `(e: SplineEvent) => void` | Function handler for Mouse Hover events |
| `onMouseUp?`    | `(e: SplineEvent) => void` | Function handler for Mouse Up events    |
| `onKeyDown?`    | `(e: SplineEvent) => void` | Function handler for Key Down events    |
| `onKeyUp?`      | `(e: SplineEvent) => void` | Function handler for Key Up events      |
| `onStart?`      | `(e: SplineEvent) => void` | Function handler for Start events       |
| `onLookAt?`     | `(e: SplineEvent) => void` | Function handler for Look At events     |
| `onFollow?`     | `(e: SplineEvent) => void` | Function handler for Mouse Up events    |
| `onScroll?`     | `(e: SplineEvent) => void` | Function handler for Scroll events      |

### Spline Ref Methods

| Name               | Type                                                 | Description                                                                                                                 |
| ------------------ | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `emitEvent`        | `(eventName: SplineEventName, uuid: string) => void` | Triggers a Spline event associated to an object with provided uuid in reverse order. Starts from first state to last state. |
| `emitEventReverse` | `(eventName: SplineEventName, uuid: string) => void` | Triggers a Spline event associated to an object with provided uuid in reverse order. Starts from last state to first state. |
| `findObjectById`   | `(uuid: string) => SPEObject`                        | Searches through scene's children and returns the object with that uuid.                                                    |
| `findObjectByName` | `(name: string) => SPEObject`                        | Searches through scene's children and returns the first object with that name                                               |
| `setZoom`          | `(zoom: number) => void`                             | Sets the initial zoom of the scene.                                                                                         |

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
yarn deploy
```
