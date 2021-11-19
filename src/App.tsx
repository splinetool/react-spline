import { useRef, MouseEvent, useState } from 'react';
import { Spline, SplineRef } from './lib/Spline';

import './App.css';
import { SplineEvent } from './lib/runtime/runtime';

function App() {
  const splineRef = useRef<SplineRef>(null);

  const [isLoading, setIsLoading] = useState(true);

  function handleMouseDown(e: SplineEvent) {
    if (e.target.id === '16D375AA-1D37-43BC-B384-BF2F7E763DAC') {
      console.log('you clicked the green button');
    }
    if (e.target.name === 'Button') {
      console.log('you clicked a button');
    }
  }

  function handleMouseHover(e: SplineEvent) {
    console.log(`you hovered on object with object id ${e.target.id}`);
  }

  function triggerClickGreen(e: MouseEvent) {
    splineRef.current?.emitEvent(
      'mouseDown',
      '16D375AA-1D37-43BC-B384-BF2F7E763DAC'
    );
  }
  function triggerClickPurple(e: MouseEvent) {
    splineRef.current?.emitEvent(
      'mouseDown',
      '8E8C2DDD-18B6-4C54-861D-7ED2519DE20E'
    );
  }
  function triggerClickBlue(e: MouseEvent) {
    splineRef.current?.emitEvent(
      'mouseDown',
      '6E4897B1-2F5C-4605-AA44-6EC1CA1079A1'
    );
  }

  return (
    <div
      style={{
        maxWidth: '512px',
        margin: 'auto',
      }}
    >
      {isLoading && (
        <div style={{ width: '512px', height: '512px' }}>Loading...</div>
      )}
      <Spline
        ref={splineRef}
        scene="/scene.json"
        id="myCanvas"
        onMouseDown={handleMouseDown}
        onMouseHover={handleMouseHover}
        onLoad={() => setIsLoading(false)}
        responsive
      />
      <button type="button" onClick={triggerClickGreen}>
        Trigger green button
      </button>
      <button type="button" onClick={triggerClickPurple}>
        Trigger purple button
      </button>
      <button type="button" onClick={triggerClickBlue}>
        Trigger blue button
      </button>
    </div>
  );
}

export default App;
