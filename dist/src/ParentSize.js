"use client";
import { jsx as F } from "react/jsx-runtime";
import b from './../external/lodash.debounce/index.js';
import { forwardRef as g, useRef as m, useState as j, useMemo as k, useEffect as B } from "react";
import { mergeRefs as E } from './../external/react-merge-refs/dist/index.js';
const I = [], K = { width: "100%", height: "100%" }, M = g(function({
  className: w,
  children: p,
  debounceTime: i = 300,
  ignoreDimensions: s = I,
  parentSizeStyles: z,
  enableDebounceLeadingCall: u = !0,
  resizeObserverPolyfill: f,
  ...R
}, S) {
  const o = m(null), d = m(0), [v, y] = j({
    width: 0,
    height: 0,
    top: 0,
    left: 0
  }), n = k(() => {
    const a = Array.isArray(s) ? s : [s];
    return b(
      (e) => {
        y((r) => Object.keys(r).filter(
          (t) => r[t] !== e[t]
        ).every(
          (t) => a.includes(t)
        ) ? r : e);
      },
      i,
      { leading: u }
    );
  }, [i, u, s]);
  return B(() => {
    const a = f || window.ResizeObserver, e = new a((r) => {
      r.forEach((c) => {
        const { left: h, top: l, width: t, height: A } = (c == null ? void 0 : c.contentRect) ?? {};
        d.current = window.requestAnimationFrame(() => {
          n({ width: t, height: A, top: l, left: h });
        });
      });
    });
    return o.current && e.observe(o.current), () => {
      window.cancelAnimationFrame(d.current), e.disconnect(), n.cancel();
    };
  }, [n, f]), /* @__PURE__ */ F(
    "div",
    {
      style: { ...K, ...z },
      ref: E([S, o]),
      className: w,
      ...R,
      children: p({
        ...v,
        ref: o.current,
        resize: n
      })
    }
  );
});
export {
  M as default
};
