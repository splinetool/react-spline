import { jsxs as o, Fragment as p, jsx as m } from "react/jsx-runtime";
import { decodePreview as s } from "./src/next/decodePreview.js";
import f from "next/image";
import x from "./react-spline.js";
function c({
  placeholder: i,
  width: r,
  height: t,
  ...n
}) {
  const e = i && s(i);
  return /* @__PURE__ */ o(p, { children: [
    e && /* @__PURE__ */ m(
      f,
      {
        src: e,
        id: i,
        alt: "Spline preview",
        style: {
          width: r ? r + "px" : "100%",
          height: t ? t + "px" : "100%"
        },
        width: r ?? 100,
        height: t ?? 100
      }
    ),
    /* @__PURE__ */ m(x, { placeholder: i, ...n })
  ] });
}
export {
  c as default
};
