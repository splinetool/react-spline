import { useRef, useState, useEffect } from 'react';
import type { SPEObject, SplineEvent } from '@splinetool/runtime';
import { Spline, SplineRef } from '../src/Spline';
import anime from 'animejs';

function OldExample() {
  const splineRef = useRef<SplineRef>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOn, setIsOn] = useState(true);

  const lightRef = useRef<SPEObject>();

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'a') {
        setIsOn((current) => !current);
      }
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const light = splineRef.current?.findObjectByName('Directional Light');
    lightRef.current = light;
  }, [splineRef.current?.findObjectByName]);

  useEffect(() => {
    if (isOn) {
      splineRef.current?.emitEventReverse(
        'mouseDown',
        '96E5E232-68FD-474E-9F9C-85EF9F8A354A'
      );
      anime({
        targets: lightRef.current,
        intensity: 0.8,
        duration: 500,
      });

      document.documentElement.style.setProperty(
        '--background',
        'hsl(229.6, 57.8%, 82.4%)'
      );
    } else {
      splineRef.current?.emitEvent(
        'mouseDown',
        '96E5E232-68FD-474E-9F9C-85EF9F8A354A'
      );

      anime({
        targets: lightRef.current,
        intensity: 0,
        duration: 500,
      });

      document.documentElement.style.setProperty(
        '--background',
        'hsl(229.6, 10.8%, 5.4%)'
      );
    }
  }, [isOn]);

  function handleMouseDown(e: SplineEvent) {
    if (e.target.name === 'Switch') {
      setIsOn((current) => !current);
    }
  }

  function handleMoveLight(direction: 'left' | 'right' | 'up' | 'down') {
    if (lightRef.current) {
      switch (direction) {
        case 'left':
          lightRef.current.position.x -= 100;
          break;
        case 'right':
          lightRef.current.position.x += 100;
          break;
        case 'up':
          lightRef.current.position.y -= 100;
          break;
        case 'down':
          lightRef.current.position.y += 100;
          break;
      }
    }
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
        scene="https://draft-dev.spline.design/2Uw-TdfHVr2SkSYA/scene.json"
        id="myCanvas"
        onMouseDown={handleMouseDown}
        onLoad={() => setIsLoading(false)}
      />
      <button type="button" onClick={() => setIsOn((current) => !current)}>
        Switch {isOn ? 'off' : 'on'}
      </button>{' '}
      or Press 'A' keyword
      <div>
        <button type="button" onClick={() => handleMoveLight('left')}>
          Move light to left
        </button>
        <button type="button" onClick={() => handleMoveLight('right')}>
          Move light to right
        </button>
        <button type="button" onClick={() => handleMoveLight('up')}>
          Move light up
        </button>
        <button type="button" onClick={() => handleMoveLight('down')}>
          Move light down
        </button>
      </div>
    </div>
  );
}
