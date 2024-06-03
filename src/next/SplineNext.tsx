import { blurHashToDataURL } from "./decodePreview";
import Image from "next/image";
import { SplineClient } from "./SplineClient";
import type { SplineProps } from "../Spline";

export function SplineNext({
  hash,
  ...props
}: SplineProps & {
  hash?: string;
}) {
  const img = hash && blurHashToDataURL(hash);
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {img && (
        <Image
          src={img}
          id={hash}
          alt="Spline preview"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
          }}
          width={100}
          height={100}
        />
      )}
      <SplineClient imageId={hash} {...props} />
    </div>
  );
}
