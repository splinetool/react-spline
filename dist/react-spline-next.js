import { jsx as h, Fragment as o } from "react/jsx-runtime";
import { decodePreview as a } from "./src/next/decodePreview.js";
import p from "next/image";
import d from "./react-spline.js";
async function l(n) {
  const t = /^https:\/\/([^\/]+).spline.design\/([^\/]+)\/scene.splinecode/gi.exec(
    n
  );
  let i = {};
  if (t != null && t[2]) {
    const s = t[1], r = t[2];
    try {
      const e = await (await fetch(`https://${s}.spline.design/${r}/hash`, {
        cache: process.env.NODE_ENV === "production" ? "force-cache" : "no-store"
      })).json();
      Object.assign(i, e), i.img = a(e.hash, e.alpha, e.width, e.height);
    } catch (c) {
      console.error(c);
    }
  }
  return i;
}
async function u({ ...n }) {
  const {
    hash: t,
    img: i,
    frameWidth: s,
    frameHeight: r,
    width: c,
    height: e
  } = await l(n.scene);
  return /* @__PURE__ */ h(o, { children: /* @__PURE__ */ h(d, { ...n, children: i && /* @__PURE__ */ h(
    p,
    {
      src: i,
      alt: "Spline preview",
      style: {
        width: s ? s + "px" : "100%",
        height: r ? r + "px" : "100%"
      },
      width: c ?? 100,
      height: e ?? 100
    }
  ) }) });
}
export {
  u as default
};
