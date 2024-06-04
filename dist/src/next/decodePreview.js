import { decode as U } from './../../external/blurhash/dist/esm/index.js';
import { thumbHashToDataURL as b } from './../../external/thumbhash/thumbhash.js';
function k(n) {
  const f = n[0] === "0";
  return n = n.slice(1), f ? b(N(n)) : O(n);
}
function N(n) {
  return new Uint8Array(
    atob(n).split("").map((f) => f.charCodeAt(0))
  );
}
function O(n, f = 32, i = 32) {
  if (!n)
    return;
  const l = U(n, f, i);
  return M(l, f, i);
}
function M(n, f, i) {
  const l = [...n].map((d) => String.fromCharCode(d)).join(""), s = B(f, i, l);
  return "data:image/png;base64," + (typeof Buffer < "u" ? Buffer.from(x(s)).toString("base64") : btoa(s));
}
function x(n) {
  const f = new Uint8Array(n.length);
  for (let i = 0; i < n.length; i++)
    f[i] = n.charCodeAt(i);
  return f;
}
function B(n, f, i) {
  const l = "x", s = [], T = `PNG\r

`, d = "\0";
  let C, c, S;
  for (C = 0; C < 256; C++) {
    for (c = C, S = 0; S < 8; S++)
      c & 1 ? c = 3988292384 ^ c >>> 1 : c = c >>> 1;
    s[C] = c;
  }
  function h(r) {
    let t = "", e, a;
    for (let g = 0; g < r.length; g += 65535)
      e = r.length - g, a = "", e <= 65535 ? a = "" : (e = 65535, a = "\0"), t += a + String.fromCharCode(e & 255, (e & 65280) >>> 8), t += String.fromCharCode(
        ~e & 255,
        (~e & 65280) >>> 8
      ), t += r.substring(g, g + e);
    return t;
  }
  function p(r) {
    let o = 65521, t = 1, e = 0;
    for (let a = 0; a < r.length; a++)
      t = (t + r.charCodeAt(a)) % o, e = (e + t) % o;
    return e << 16 | t;
  }
  function D(r, o) {
    let t = r, e;
    for (let a = 0; a < o.length; a++)
      e = o.charCodeAt(a), t = s[(t ^ e) & 255] ^ t >>> 8;
    return t;
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
  function A(r, o, t) {
    const e = L(o + t);
    return u(r) + o + t + u(e);
  }
  function _(r, o) {
    const t = u(r) + u(o) + // bit depth
    "\b\0\0\0";
    return A(13, "IHDR", t);
  }
  const H = A(0, "IEND", ""), I = _(n, f);
  let R = "", m;
  for (let r = 0; r < i.length; r += n * 4) {
    if (m = d, Array.isArray(i))
      for (let o = 0; o < n * 4; o++)
        m += String.fromCharCode(i[r + o] & 255);
    else
      m += i.substr(r, n * 4);
    R += m;
  }
  const E = l + h(R) + u(p(R)), y = A(
    E.length,
    "IDAT",
    E
  );
  return T + I + y + H;
}
export {
  k as decodePreview
};
