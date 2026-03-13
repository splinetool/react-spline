import React, { useRef, useState } from 'react';
import type { Application } from '@splinetool/runtime';
import Spline from '../src/Spline';

const SCENE_URL =
  'https://prod.spline.design/RxuLN4oiCmjcM-Fw/scene.splinecode';

function SplinePage({
  applicationRef,
}: {
  applicationRef: React.MutableRefObject<Application | null>;
}) {
  return (
    <div style={{  width: 800, height: 600, position: 'relative',top: 100, left: 20 }}>
      <Spline
        scene={SCENE_URL}
        applicationRef={applicationRef}
        onLoad={(app) => {
          console.log(
            'Spline loaded — reused:',
            app === applicationRef.current
          );
        }}
      >
        <p style={{ padding: 16 }}>Loading scene…</p>
      </Spline>
    </div>
  );
}

function OtherPage() {
  return (
    <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
      <p>This is another page. The Spline component is fully unmounted.</p>
    </div>
  );
}

function App() {
  const [page, setPage] = useState<'spline' | 'other'>('spline');
  const splineApp = useRef<Application | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <nav className="buttons">
        <button type="button" onClick={() => setPage('spline')}>
          Spline Page
        </button>
        <button type="button" onClick={() => setPage('other')}>
          Other Page
        </button>
        <button
          type="button"
          onClick={() => {
            splineApp.current?.dispose();
            splineApp.current = null;
            console.log('Application manually disposed');
          }}
        >
          Dispose
        </button>
      </nav>

      {page === 'spline' ? (
        <SplinePage applicationRef={splineApp} />
      ) : (
        <OtherPage />
      )}
    </div>
  );
}

export default App;
