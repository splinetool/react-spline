import { useRef, useState, useEffect } from 'react';
import type { SPEObject, SplineEvent } from '@splinetool/runtime';
import { Spline, SplineRef } from '../src/Spline';
import anime from 'animejs';

function App() {
  const splineRef = useRef<SplineRef>(null);
  const [isLoading, setIsLoading] = useState(true);

  const tileRef = useRef<SPEObject>();
  useEffect(() => {
    const tile = splineRef.current?.findObjectById(
      '7ba78968-2a55-48f2-b14c-5191da3e075e'
    );
    tileRef.current = tile;
  }, [splineRef.current]);

  function handleMoveTile(direction: 'left' | 'right' | 'up' | 'down') {
    if (tileRef.current) {
      const newPosition = { ...tileRef.current.position };
      switch (direction) {
        case 'left':
          newPosition.x -= 100;
          break;
        case 'right':
          newPosition.x += 100;
          break;
        case 'up':
          newPosition.y += 100;
          break;
        case 'down':
          newPosition.y -= 100;
          break;
      }
      anime({
        targets: tileRef.current.position,
        ...newPosition,
        duration: 500,
      });
    }
  }

  return (
    <>
      <div className='buttons'>
        <button type="button" onClick={() => handleMoveTile('left')}>
          Move tile to left
        </button>
        <button type="button" onClick={() => handleMoveTile('right')}>
          Move tile to right
        </button>
        <button type="button" onClick={() => handleMoveTile('up')}>
          Move tile up
        </button>
        <button type="button" onClick={() => handleMoveTile('down')}>
          Move tile down
        </button>
      </div>
      <Spline
        ref={splineRef}
        autoRender
        scene="https://prod.spline.design/ft9KFAMYebCiRXbC/scene.spline"
        onLoad={() => {
          setIsLoading(false);
        }}
      />
    </>
  );
}

export default App;
