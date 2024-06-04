import { jsxs as o, Fragment as a, jsx as h } from "react/jsx-runtime";
import { decodePreview as p } from "./src/next/decodePreview.js";
import d from "next/image";
import l from "./react-spline.js";
async function g(s) {
  const e = /^https:\/\/([^\/]+).spline.design\/([^\/]+)\/scene.splinecode/gi.exec(
    s
  );
  let i = {};
  if (e != null && e[2]) {
    const n = e[1], r = e[2];
    try {
      const t = await (await fetch(`https://${n}.spline.design/${r}/hash`, {
        cache: process.env.NODE_ENV === "production" ? "force-cache" : "no-store"
      })).json();
      Object.assign(i, t), i.img = p(t.hash, t.alpha, t.width, t.height);
    } catch (c) {
      console.error(c);
    }
  }
  return i;
}
async function u({ ...s }) {
  const {
    hash: e,
    img: i,
    frameWidth: n,
    frameHeight: r,
    width: c,
    height: t
  } = await g(s.scene);
  return /* @__PURE__ */ o(a, { children: [
    i && /* @__PURE__ */ h(
      d,
      {
        src: i,
        id: e,
        alt: "Spline preview",
        style: {
          width: n ? n + "px" : "100%",
          height: r ? r + "px" : "100%"
        },
        width: c ?? 100,
        height: t ?? 100
      }
    ),
    /* @__PURE__ */ h(l, { placeholder: e, ...s })
  ] });
}
export {
  u as default
};
