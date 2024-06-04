import { decodePreview } from './decodePreview';
import Image from 'next/image';
import Spline, { SplineProps } from '../Spline';

export default function SplineNext({
  placeholder,
  width,
  height,
  ...props
}: SplineProps) {
  const img = placeholder && decodePreview(placeholder);
  return (
    <>
      {img && (
        <Image
          src={img}
          id={placeholder}
          alt="Spline preview"
          style={{
            width: width ? width + 'px' : '100%',
            height: height ? height + 'px' : '100%',
          }}
          width={width ?? 100}
          height={height ?? 100}
        />
      )}
      <Spline placeholder={placeholder} {...props} />
    </>
  );
}
