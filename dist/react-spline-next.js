import { jsxs as r, Fragment as a, jsx as h } from "react/jsx-runtime";
import { decodePreview as d } from "./src/next/decodePreview.js";
import p from "next/image";
import l from "./react-spline.js";
async function f(n) {
  const e = /^https:\/\/([^\/]+).spline.design\/([^\/]+)\/scene.splinecode/gi.exec(
    n
  );
  let i = {};
  if (e != null && e[2]) {
    const s = e[1], o = e[2];
    try {
      const t = await (await fetch(`https://${s}.spline.design/${o}/hash`, {
        cache: process.env.NODE_ENV === "production" ? "force-cache" : "no-store"
      })).json();
      Object.assign(i, t), i.img = d(t.hash, t.alpha, t.width, t.height);
    } catch (c) {
      console.error(c);
    }
  }
  return i;
}
async function u({ ...n }) {
  const {
    hash: e,
    img: i,
    frameWidth: s,
    frameHeight: o,
    width: c,
    height: t
  } = await f(n.scene);
  return /* @__PURE__ */ r(a, { children: [
    i && /* @__PURE__ */ h(
      p,
      {
        src: i,
        id: e,
        alt: "Spline preview",
        style: {
          width: s ? s + "px" : "100%",
          height: o ? o + "px" : "100%"
        },
        width: c ?? 100,
        height: t ?? 100
      }
    ),
    /* @__PURE__ */ h(
      l,
      {
        placeholder: e,
        ...n,
        style: {
          ...n.style,
          ...typeof window > "u" ? { display: "none" } : {}
        }
      }
    )
  ] });
}
export {
  u as default
};
