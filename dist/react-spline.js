"use client";
import { jsx as f } from "react/jsx-runtime";
import { forwardRef as x, useRef as z, useState as D, useEffect as I } from "react";
import { Application as U } from "@splinetool/runtime";
import h from "./src/ParentSize.js";
const P = x(
  ({
    scene: s,
    style: l,
    onMouseDown: u,
    onMouseUp: p,
    onMouseHover: b,
    onKeyDown: v,
    onKeyUp: d,
    onStart: y,
    onLookAt: w,
    onFollow: E,
    onWheel: S,
    onLoad: r,
    renderOnDemand: k = !0,
    placeholder: c,
    ...A
  }, R) => {
    const o = z(null), [g, a] = D(!0);
    return I(() => {
      a(!0);
      let t;
      const i = [
        {
          name: "mouseDown",
          cb: u
        },
        {
          name: "mouseUp",
          cb: p
        },
        {
          name: "mouseHover",
          cb: b
        },
        {
          name: "keyDown",
          cb: v
        },
        {
          name: "keyUp",
          cb: d
        },
        {
          name: "start",
          cb: y
        },
        {
          name: "lookAt",
          cb: w
        },
        {
          name: "follow",
          cb: E
        },
        {
          name: "scroll",
          cb: S
        }
      ];
      if (o.current) {
        t = new U(o.current, { renderOnDemand: k });
        async function n() {
          var m;
          await t.load(s);
          for (let e of i)
            e.cb && t.addEventListener(e.name, e.cb);
          if (a(!1), r == null || r(t), c) {
            const e = document.getElementById(c);
            (m = e == null ? void 0 : e.parentElement) == null || m.removeChild(e);
          }
        }
        n();
      }
      return () => {
        for (let n of i)
          n.cb && t.removeEventListener(n.name, n.cb);
        t.dispose();
      };
    }, [s]), /* @__PURE__ */ f(
      h,
      {
        ref: R,
        parentSizeStyles: l,
        debounceTime: 50,
        ...A,
        children: () => /* @__PURE__ */ f(
          "canvas",
          {
            ref: o,
            style: {
              display: g ? "none" : "block"
            }
          }
        )
      }
    );
  }
);
export {
  P as default
};
