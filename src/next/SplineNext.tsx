import { blurHashToDataURL } from './decodePreview';
import Image from 'next/image';
import Spline, { SplineProps } from '../Spline';

export default function SplineNext({ placeholder, ...props }: SplineProps) {
  const img = placeholder && blurHashToDataURL(placeholder);
  return (
    <>
      {img && (
        <Image
          src={img}
          id={placeholder}
          alt="Spline preview"
          style={{
            width: '100%',
            height: '100%',
          }}
          width={100}
          height={100}
        />
      )}
      <Spline placeholder={placeholder} {...props} />
    </>
  );
}
