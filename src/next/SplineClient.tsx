"use client";

import Spline, { SplineProps } from "../Spline";

export function SplineClient({
  imageId,
  ...props
}: SplineProps & { imageId?: string }) {
  return (
    <Spline
      {...props}
      onLoad={(e) => {
        if (imageId) {
          const img = document.getElementById(imageId);
          if (img) {
            img.style.display = "none";
          }
        }
        props.onLoad?.(e);
      }}
    />
  );
}
