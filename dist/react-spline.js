"use client";
import { jsx as f } from "react/jsx-runtime";
import { forwardRef as D, useRef as U, useState as l, useEffect as h } from "react";
import { Application as j } from "@splinetool/runtime";
import B from "./src/ParentSize.js";
const q = D(
  ({
    scene: o,
    style: u,
    onMouseDown: p,
    onMouseUp: b,
    onMouseHover: d,
    onKeyDown: v,
    onKeyUp: S,
    onStart: y,
    onLookAt: w,
    onFollow: E,
    onWheel: R,
    onLoad: s,
    renderOnDemand: k = !0,
    placeholder: c,
    ...A
  }, I) => {
    const r = U(null), [g, a] = l(!0), [x, z] = l(!0);
    return h(() => {
      z(!1), a(!0);
      let t;
      const i = [
        {
          name: "mouseDown",
          cb: p
        },
        {
          name: "mouseUp",
          cb: b
        },
        {
          name: "mouseHover",
          cb: d
        },
        {
          name: "keyDown",
          cb: v
        },
        {
          name: "keyUp",
          cb: S
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
          cb: R
        }
      ];
      if (r.current) {
        t = new j(r.current, { renderOnDemand: k });
        async function n() {
          var m;
          await t.load(o);
          for (let e of i)
            e.cb && t.addEventListener(e.name, e.cb);
          if (a(!1), s == null || s(t), c) {
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
    }, [o]), /* @__PURE__ */ f(
      B,
      {
        ref: I,
        parentSizeStyles: {
          ...u,
          ...x ? { display: "none" } : {}
        },
        debounceTime: 50,
        ...A,
        children: () => /* @__PURE__ */ f(
          "canvas",
          {
            ref: r,
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
  q as default
};
