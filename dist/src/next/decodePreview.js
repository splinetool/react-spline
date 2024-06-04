import { decode as y } from './../../external/blurhash/dist/esm/index.js';
function G(o) {
  if (!o)
    return;
  const c = y(o, 32, 32);
  return O(c, 32, 32);
}
function O(o, c, f) {
  const h = [...o].map((S) => String.fromCharCode(S)).join(""), s = M(c, f, h);
  return "data:image/png;base64," + (typeof Buffer < "u" ? Buffer.from(U(s)).toString("base64") : btoa(s));
}
function U(o) {
  const c = new Uint8Array(o.length);
  for (let f = 0; f < o.length; f++)
    c[f] = o.charCodeAt(f);
  return c;
}
function M(o, c, f) {
  const h = "x", s = [], R = `PNG\r

`, S = "\0";
  let C, a, m;
  for (C = 0; C < 256; C++) {
    for (a = C, m = 0; m < 8; m++)
      a & 1 ? a = 3988292384 ^ a >>> 1 : a = a >>> 1;
    s[C] = a;
  }
  function T(r) {
    let n = "", t, i;
    for (let g = 0; g < r.length; g += 65535)
      t = r.length - g, i = "", t <= 65535 ? i = "" : (t = 65535, i = "\0"), n += i + String.fromCharCode(t & 255, (t & 65280) >>> 8), n += String.fromCharCode(
        ~t & 255,
        (~t & 65280) >>> 8
      ), n += r.substring(g, g + t);
    return n;
  }
  function D(r) {
    let e = 65521, n = 1, t = 0;
    for (let i = 0; i < r.length; i++)
      n = (n + r.charCodeAt(i)) % e, t = (t + n) % e;
    return t << 16 | n;
  }
  function L(r, e) {
    let n = r, t;
    for (let i = 0; i < e.length; i++)
      t = e.charCodeAt(i), n = s[(n ^ t) & 255] ^ n >>> 8;
    return n;
  }
  function p(r) {
    return L(4294967295, r) ^ 4294967295;
  }
  function l(r) {
    return String.fromCharCode(
      (r & 4278190080) >>> 24,
      (r & 16711680) >>> 16,
      (r & 65280) >>> 8,
      r & 255
    );
  }
  function d(r, e, n) {
    const t = p(e + n);
    return l(r) + e + n + l(t);
  }
  function _(r, e) {
    const n = l(r) + l(e) + // bit depth
    "\b\0\0\0";
    return d(13, "IHDR", n);
  }
  const H = d(0, "IEND", ""), I = _(o, c);
  let A = "", u;
  for (let r = 0; r < f.length; r += o * 4) {
    if (u = S, Array.isArray(f))
      for (let e = 0; e < o * 4; e++)
        u += String.fromCharCode(f[r + e] & 255);
    else
      u += f.substr(r, o * 4);
    A += u;
  }
  const E = h + T(A) + l(D(A)), N = d(
    E.length,
    "IDAT",
    E
  );
  return R + I + N + H;
}
export {
  G as blurHashToDataURL
};
