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

### Generate scene link from the Spline Editor

1. Go to the Export panel and select "React Component", then press "Export".
2. Spline generates a link for Development (Drafts) and Production.
   - Drafts are generated each time you press on "Generate Draft". This will create a new link.
   - All previous drafts are stored under the "Drafts" tab.
   - You can use the drafts to try ideas, and once you are ready, you can promote your changes to production.

<img src="./.github/screenshots/react-export-pane.png" width="250">

### Start using react-spline component in React

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

### Start using react-spline component in Nextjs

1. Create a wrapped component to be able to use ref.

   ```jsx
   import { Spline } from '@splinetool/react-spline';
   import { Ref } from 'react';

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
     return (
       <main>
         <Spline scene="[DRAFT OR PROD URL]" />
       </main>
     );
   }
   ```

### Listen to react-spline events

Spline is in charged of adding events and user just need to add handler function.

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

### Trigger scene events from outside

- Option 1: Using emitEvent with event name and object id.

  ```jsx
  import { Spline } from '@splinetool/react-spline';

  function App() {
  	const splineRef = useRef();

  	function handleTriggerButtonClick() {
  		splineRef.current.emitEvent('mouseHover', 'my-object-id');
  	}

  	return (
  		<main>
  			<Spline ref={splineRef} scene="[DRAFT OR PROD URL]"/>
  			<button type="button" onClick={handleTriggerButtonClick}/>
  				Trigger Button
  			</button>
  		</main>
  	)
  }

  ```

- Option 2: Querying object and trigger event using emitEvent object method.

  ```jsx
  import { Spline } from '@splinetool/react-spline';

  function App() {
  	const splineRef = useRef();
  	const [myObj, setMyObj] = useState(null);

  	useEffect(() => {
  		const obj = splineRef.current.findObjectById('my-object-id')
  		setMyObj(obj)
  	}, [splineRef])

  	function handleTriggerButtonClick() {
  		myObj.emitEvent('mouseHover');
  	}

  	return (
  		<main>
  			<Spline ref={splineRef} scene="[DRAFT OR PROD URL]"/>
  			<button type="button" onClick={handleTriggerButtonClick}/>
  				Trigger Button
  			</button>
  		</main>
  	)
  }
  ```

### Read and modify spline objects

```jsx
import { Spline } from '@splinetool/react-spline';

function App() {
	const splineRef = useRef();
	const [myObj, setMyObj] = useState(null);

	useEffect(() => {
		const obj = splineRef.current.findObjectById('my-object-id')
		setMyObj(obj)
	}, [splineRef])

	function handleClick() {
		console.log(myObj) // SPE Proxy Object => { name: 'my object', id: '8E8C2DDD-18B6-4C54-861D-7ED2519DE20E', ... }
	}

	return (
		<main>
			<Spline ref={splineRef} scene="[DRAFT OR PROD URL]"/>
			<button type="button" onClick={handleClick}/>
				Log {myObj.name} info
			</button>
		</main>
	)
}
```

## API

### Spline Component Props

| Name          | Type                       | Description                             |
| ------------- | -------------------------- | --------------------------------------- |
| scene         | `string`                   | Scene file                              |
| id?           | `string`                   | Canvas id                               |
| style?        | `string`                   | CSS style                               |
| className?    | `string`                   | CSS classes                             |
| onMouseDown?  | `(e: SplineEvent) => void` | Function handler for Mouse Down events  |
| onMouseHover? | `(e: SplineEvent) => void` | Function handler for Mouse Hover events |
| onMouseUp?    | `(e: SplineEvent) => void` | Function handler for Mouse Up events    |
| onKeyDown?    | `(e: SplineEvent) => void` | Function handler for Key Down events    |
| onKeyUp?      | `(e: SplineEvent) => void` | Function handler for Key Up events      |
| onStart?      | `(e: SplineEvent) => void` | Function handler for Start events       |
| onLookAt?     | `(e: SplineEvent) => void` | Function handler for Look At events     |
| onFollow?     | `(e: SplineEvent) => void` | Function handler for Mouse Up events    |
| onScroll?     | `(e: SplineEvent) => void` | Function handler for Scroll events      |

### Spline Container Ref Methods

| Name             | Type                                     | Description                                                                                                                 |
| ---------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| emitEvent        | (eventName: string, uuid:string) => void | Triggers a Spline event associated to an object with provided uuid in reverse order. Starts from first state to last state. |
| emitEventReverse | (eventName: string, uuid:string) => void | Triggers a Spline event associated to an object with provided uuid in reverse order. Starts from last state to first state. |
| findObjectById   | (uuid: string) => SPEObject              | Searches through scene's children and returns the object with that uuid.                                                    |
| findObjectByName | (name: string) => SPEObject              | Searches through scene's children and returns the first object with that name                                               |

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
