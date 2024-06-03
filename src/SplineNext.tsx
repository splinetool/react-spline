import SplineClient, { SplineProps } from './Spline';
import Image from 'next/image';
import { useMemo, useRef } from 'react';
import { blurHashToDataURL } from './decodePreview';

const SplineNext = ({
  scene,
  preview,
  previewWidth,
  previewHeight,
  ...props
}: SplineProps & {
  preview?: string;
  previewWidth?: number;
  previewHeight?: number;
}) => {
  const imageRef = useRef<HTMLImageElement>();
  const base64BlurHash = useMemo(() => {
    const params = new URLSearchParams(scene);
    const blurhash = preview ?? params.get('bh') ?? undefined;
    return blurhash ? blurHashToDataURL(blurhash) : null;
  }, [scene, preview]);
  return base64BlurHash ? (
    <div style={{ position: 'relative' }}>
      <Image
        blurDataURL={base64BlurHash || undefined}
        placeholder="blur"
        alt="Spline Scene"
        src={base64BlurHash}
        ref={imageRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: previewWidth ? previewWidth + 'px' : '100%',
          height: previewHeight ? previewHeight + 'px' : '100%',
        }}
      />
      <SplineClient
        scene={scene}
        {...props}
        onLoad={(app) => {
          if (imageRef.current) imageRef.current.style.display = 'none';
          props.onLoad?.(app);
        }}
      />
    </div>
  ) : (
    <SplineClient scene={scene} {...props} />
  );
};
export default SplineNext;
