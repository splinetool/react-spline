import { decodePreview } from './decodePreview';
import Image from 'next/image';
import Spline, { SplineProps } from '../Spline';

async function getPreview(scene: string) {
  const matches =
    /^https:\/\/([^\/]+).spline.design\/([^\/]+)\/scene.splinecode/gi.exec(
      scene
    );
  let placeholder: string | undefined = undefined;
  let img: string | undefined = undefined;
  if (matches?.[2]) {
    const scope = matches[1]; // prod or draft
    const id = matches[2];
    try {
      const res = await fetch(`https://${scope}.spline.design/${id}/hash`);
      placeholder = await res.text();
      img = decodePreview(placeholder);
    } catch (e) {}
  }
  return { placeholder, img };
}

export default async function SplineNext({
  width,
  height,
  ...props
}: SplineProps) {
  const data = await getPreview(props.scene);
  return (
    <>
      {data.img && (
        <Image
          src={data.img}
          id={data.placeholder}
          alt="Spline preview"
          style={{
            width: width ? width + 'px' : '100%',
            height: height ? height + 'px' : '100%',
          }}
          width={width ?? 100}
          height={height ?? 100}
        />
      )}
      <Spline placeholder={data.placeholder} {...props} />
    </>
  );
}
