import { jsxs as o, Fragment as c, jsx as a } from "react/jsx-runtime";
import { decodePreview as p } from "./src/next/decodePreview.js";
import d from "next/image";
import l from "./react-spline.js";
async function g(s) {
  const e = /^https:\/\/([^\/]+).spline.design\/([^\/]+)\/scene.splinecode/gi.exec(
    s
  );
  let i = {};
  if (e != null && e[2]) {
    const n = e[1], h = e[2];
    try {
      const t = await (await fetch(`https://${n}.spline.design/${h}/hash`)).json();
      Object.assign(i, t), i.img = p(t.hash, t.alpha, t.width, t.height);
    } catch (r) {
      console.error(r);
    }
  }
  return i;
}
async function u({ ...s }) {
  const {
    hash: e,
    img: i,
    frameWidth: n,
    frameHeight: h,
    width: r,
    height: t
  } = await g(s.scene);
  return /* @__PURE__ */ o(c, { children: [
    i && /* @__PURE__ */ a(
      d,
      {
        src: i,
        id: e,
        alt: "Spline preview",
        style: {
          width: n ? n + "px" : "100%",
          height: h ? h + "px" : "100%"
        },
        width: r ?? 100,
        height: t ?? 100
      }
    ),
    /* @__PURE__ */ a(l, { placeholder: e, ...s })
  ] });
}
export {
  u as default
};
