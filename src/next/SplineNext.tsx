import { decodePreview } from './decodePreview';
import Image from 'next/image';
import Spline, { SplineProps } from '../Spline';

type Hash = {
  hash?: string;
  alpha?: boolean;
  width?: number;
  height?: number;
  frameWidth?: number;
  frameHeight?: number;
};

async function getPreview(scene: string) {
  const matches =
    /^https:\/\/([^\/]+).spline.design\/([^\/]+)\/scene.splinecode/gi.exec(
      scene
    );
  let hash: Hash & { img?: string } = {};
  if (matches?.[2]) {
    const scope = matches[1]; // prod or draft
    const id = matches[2];
    try {
      const res = await fetch(`https://${scope}.spline.design/${id}/hash`, {
        cache:
          process.env.NODE_ENV === 'production' ? 'force-cache' : 'no-store',
      });
      const data = (await res.json()) as Required<Hash>;
      Object.assign(hash, data);
      hash.img = decodePreview(data.hash, data.alpha, data.width, data.height);
    } catch (e) {
      console.error(e);
    }
  }
  return hash;
}

export default async function SplineNext({ ...props }: SplineProps) {
  const {
    hash: placeholder,
    img,
    frameWidth,
    frameHeight,
    width,
    height,
  } = await getPreview(props.scene);
  return (
    <div style={{ position: 'relative' }}>
      {img && (
        <Image
          src={img}
          id={placeholder}
          alt="Spline preview"
          style={{
            width: frameWidth ? frameWidth + 'px' : '100%',
            height: frameHeight ? frameHeight + 'px' : '100%',
          }}
          width={width ?? 100}
          height={height ?? 100}
        />
      )}
      <Spline placeholder={placeholder} {...props} />
    </div>
  );
}
