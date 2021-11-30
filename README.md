# react-spline

> A component to easily run Spline scenes in React apps.

## Table of Contents

- [Install](#install)
- [Usage](#usage)

  - [Generate scene link](#generate-scene-link)
  - [Start using react-spline component in React App](#start-using-react-spline-component-in-react-app)
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
   1. Drafts are generated each time you press on "Generate Draft". This will create a new link.
   2. All previous drafts are stored under the "Drafts" tab.
   3. You can use the drafts to try ideas, and once you are ready, you can promote your changes to production.

### Start using react-spline component in your React App

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

For now, you need to use also:

- `yarn add link:path/to/runtime` in order to use the updated version that is merge in dev.
- `yarn link` and then `yarn link @splinetool/react-spline`.

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