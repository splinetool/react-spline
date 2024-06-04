"use client";
import { jsx as m, jsxs as A, Fragment as E } from "react/jsx-runtime";
import { forwardRef as R, useRef as j, useState as z, useEffect as D } from "react";
import { Application as U } from "@splinetool/runtime";
import F from "./src/ParentSize.js";
const q = R(
  ({
    scene: s,
    style: f,
    onMouseDown: l,
    onMouseUp: u,
    onMouseHover: p,
    onKeyDown: b,
    onKeyUp: d,
    onStart: v,
    onLookAt: w,
    onFollow: y,
    onWheel: S,
    onLoad: t,
    renderOnDemand: k = !0,
    children: g,
    ...h
  }, x) => {
    const r = j(null), [c, a] = z(!0);
    return D(() => {
      a(!0);
      let e;
      const i = [
        {
          name: "mouseDown",
          cb: l
        },
        {
          name: "mouseUp",
          cb: u
        },
        {
          name: "mouseHover",
          cb: p
        },
        {
          name: "keyDown",
          cb: b
        },
        {
          name: "keyUp",
          cb: d
        },
        {
          name: "start",
          cb: v
        },
        {
          name: "lookAt",
          cb: w
        },
        {
          name: "follow",
          cb: y
        },
        {
          name: "scroll",
          cb: S
        }
      ];
      if (r.current) {
        e = new U(r.current, { renderOnDemand: k });
        async function n() {
          await e.load(s);
          for (let o of i)
            o.cb && e.addEventListener(o.name, o.cb);
          a(!1), t == null || t(e);
        }
        n();
      }
      return () => {
        for (let n of i)
          n.cb && e.removeEventListener(n.name, n.cb);
        e.dispose();
      };
    }, [s]), /* @__PURE__ */ m(
      F,
      {
        ref: x,
        parentSizeStyles: { overflow: "hidden", ...f },
        debounceTime: 50,
        ...h,
        children: () => /* @__PURE__ */ A(E, { children: [
          c && g,
          /* @__PURE__ */ m(
            "canvas",
            {
              ref: r,
              style: {
                display: c ? "none" : "block"
              }
            }
          )
        ] })
      }
    );
  }
);
export {
  q as default
};
