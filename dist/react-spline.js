"use client";
import { jsx as m, jsxs as E, Fragment as R } from "react/jsx-runtime";
import { forwardRef as h, useRef as j, useState as z, useEffect as D } from "react";
import { Application as U } from "@splinetool/runtime";
import F from "./src/ParentSize.js";
const q = h(
  ({
    scene: o,
    style: f,
    onMouseDown: l,
    onMouseUp: u,
    onMouseHover: p,
    onKeyDown: b,
    onKeyUp: v,
    onStart: d,
    onLookAt: w,
    onFollow: y,
    onWheel: S,
    onLoad: t,
    renderOnDemand: k = !0,
    children: g,
    ...x
  }, A) => {
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
          cb: v
        },
        {
          name: "start",
          cb: d
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
          await e.load(o);
          for (let s of i)
            s.cb && e.addEventListener(s.name, s.cb);
          a(!1), t == null || t(e);
        }
        n();
      }
      return () => {
        for (let n of i)
          n.cb && e.removeEventListener(n.name, n.cb);
        e.dispose();
      };
    }, [o]), /* @__PURE__ */ m(
      F,
      {
        ref: A,
        parentSizeStyles: f,
        debounceTime: 50,
        ...x,
        children: () => /* @__PURE__ */ E(R, { children: [
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
