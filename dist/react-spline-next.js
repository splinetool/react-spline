import { jsxs as e, Fragment as n, jsx as r } from "react/jsx-runtime";
import { blurHashToDataURL as o } from "./src/next/decodePreview.js";
import s from "next/image";
import f from "./react-spline.js";
function u({ placeholder: t, ...m }) {
  const i = t && o(t);
  return /* @__PURE__ */ e(n, { children: [
    i && /* @__PURE__ */ r(
      s,
      {
        src: i,
        id: t,
        alt: "Spline preview",
        style: {
          width: "100%",
          height: "100%"
        },
        width: 100,
        height: 100
      }
    ),
    /* @__PURE__ */ r(f, { placeholder: t, ...m })
  ] });
}
export {
  u as default
};
