import { useRef, useState, useEffect } from 'react';
import { Spline, SplineRef } from '../src/Spline';

function App() {
  const [currentScene, setCurrentScene] = useState(
    'https://draft-dev.spline.design/ZwMhP2os1JwQvQNG/scene.spline'
  );
  const ref = useRef<SplineRef>(null);

  useEffect(() => {
    console.log(ref.current);
  }, [ref.current]);

  return (
    <div className="App">
      <button
        type="button"
        onClick={(e) => {
          if (
            currentScene ===
            'https://draft-dev.spline.design/ZwMhP2os1JwQvQNG/scene.spline'
          ) {
            setCurrentScene(
              'https://draft-dev.spline.design/YP4SD9-1YsZECTmX/scene.spline'
            );
          } else {
            setCurrentScene(
              'https://draft-dev.spline.design/ZwMhP2os1JwQvQNG/scene.spline'
            );
          }
        }}
      >
        Change Scene
      </button>
      <Spline ref={ref} scene={currentScene} />
    </div>
  );
}

export default App;
