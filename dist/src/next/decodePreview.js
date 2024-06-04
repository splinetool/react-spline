import { decode as U } from './../../external/blurhash/dist/esm/index.js';
import { thumbHashToDataURL as b } from './../../external/thumbhash/thumbhash.js';
function k(t, a = !1, o = 100, c = 100) {
  return a ? b(N(t)) : O(t, o, c);
}
function N(t) {
  return new Uint8Array(
    atob(t).split("").map((a) => a.charCodeAt(0))
  );
}
function O(t, a = 100, o = 100) {
  if (!t)
    return;
  const c = U(t, a, o);
  return M(c, a, o);
}
function M(t, a, o) {
  const c = [...t].map((d) => String.fromCharCode(d)).join(""), l = B(a, o, c);
  return "data:image/png;base64," + (typeof Buffer < "u" ? Buffer.from(x(l)).toString("base64") : btoa(l));
}
function x(t) {
  const a = new Uint8Array(t.length);
  for (let o = 0; o < t.length; o++)
    a[o] = t.charCodeAt(o);
  return a;
}
function B(t, a, o) {
  const c = "x", l = [], R = `PNG\r

`, d = "\0";
  let C, s, S;
  for (C = 0; C < 256; C++) {
    for (s = C, S = 0; S < 8; S++)
      s & 1 ? s = 3988292384 ^ s >>> 1 : s = s >>> 1;
    l[C] = s;
  }
  function E(r) {
    let n = "", e, f;
    for (let g = 0; g < r.length; g += 65535)
      e = r.length - g, f = "", e <= 65535 ? f = "" : (e = 65535, f = "\0"), n += f + String.fromCharCode(e & 255, (e & 65280) >>> 8), n += String.fromCharCode(
        ~e & 255,
        (~e & 65280) >>> 8
      ), n += r.substring(g, g + e);
    return n;
  }
  function p(r) {
    let i = 65521, n = 1, e = 0;
    for (let f = 0; f < r.length; f++)
      n = (n + r.charCodeAt(f)) % i, e = (e + n) % i;
    return e << 16 | n;
  }
  function D(r, i) {
    let n = r, e;
    for (let f = 0; f < i.length; f++)
      e = i.charCodeAt(f), n = l[(n ^ e) & 255] ^ n >>> 8;
    return n;
  }
  function L(r) {
    return D(4294967295, r) ^ 4294967295;
  }
  function u(r) {
    return String.fromCharCode(
      (r & 4278190080) >>> 24,
      (r & 16711680) >>> 16,
      (r & 65280) >>> 8,
      r & 255
    );
  }
  function h(r, i, n) {
    const e = L(i + n);
    return u(r) + i + n + u(e);
  }
  function _(r, i) {
    const n = u(r) + u(i) + // bit depth
    "\b\0\0\0";
    return h(13, "IHDR", n);
  }
  const H = h(0, "IEND", ""), I = _(t, a);
  let A = "", m;
  for (let r = 0; r < o.length; r += t * 4) {
    if (m = d, Array.isArray(o))
      for (let i = 0; i < t * 4; i++)
        m += String.fromCharCode(o[r + i] & 255);
    else
      m += o.substr(r, t * 4);
    A += m;
  }
  const T = c + E(A) + u(p(A)), y = h(
    T.length,
    "IDAT",
    T
  );
  return R + I + y + H;
}
export {
  k as decodePreview
};
