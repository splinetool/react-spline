function W(t) {
  let { PI: r, min: p, max: l, cos: u, round: c } = Math, _ = t[0] | t[1] << 8 | t[2] << 16, n = t[3] | t[4] << 8, s = (_ & 63) / 63, y = (_ >> 6 & 63) / 31.5 - 1, i = (_ >> 12 & 63) / 31.5 - 1, a = (_ >> 18 & 31) / 31, o = _ >> 23, v = (n >> 3 & 63) / 63, z = (n >> 9 & 63) / 63, G = n >> 15, B = l(3, G ? o ? 5 : 7 : n & 7), A = l(3, G ? n & 7 : o ? 5 : 7), E = o ? (t[5] & 15) / 15 : 1, F = (t[5] >> 4) / 15, J = o ? 6 : 5, I = 0, j = (L, x, R) => {
    let m = [];
    for (let b = 0; b < x; b++)
      for (let g = b ? 0 : 1; g * x < L * (x - b); g++)
        m.push(((t[J + (I >> 1)] >> ((I++ & 1) << 2) & 15) / 7.5 - 1) * R);
    return m;
  }, K = j(B, A, a), N = j(3, 3, v * 1.25), O = j(3, 3, z * 1.25), Q = o && j(5, 5, F), C = X(t), H = c(C > 1 ? 32 : 32 * C), U = c(C > 1 ? 32 / C : 32), q = new Uint8Array(H * U * 4), w = [], D = [];
  for (let L = 0, x = 0; L < U; L++)
    for (let R = 0; R < H; R++, x += 4) {
      let m = s, b = y, g = i, M = E;
      for (let e = 0, f = l(B, o ? 5 : 3); e < f; e++)
        w[e] = u(r / H * (R + 0.5) * e);
      for (let e = 0, f = l(A, o ? 5 : 3); e < f; e++)
        D[e] = u(r / U * (L + 0.5) * e);
      for (let e = 0, f = 0; e < A; e++)
        for (let d = e ? 0 : 1, T = D[e] * 2; d * A < B * (A - e); d++, f++)
          m += K[f] * w[d] * T;
      for (let e = 0, f = 0; e < 3; e++)
        for (let d = e ? 0 : 1, T = D[e] * 2; d < 3 - e; d++, f++) {
          let k = w[d] * T;
          b += N[f] * k, g += O[f] * k;
        }
      if (o)
        for (let e = 0, f = 0; e < 5; e++)
          for (let d = e ? 0 : 1, T = D[e] * 2; d < 5 - e; d++, f++)
            M += Q[f] * w[d] * T;
      let P = m - 2 / 3 * b, S = (3 * m - P + g) / 2, V = S - g;
      q[x] = l(0, 255 * p(1, S)), q[x + 1] = l(0, 255 * p(1, V)), q[x + 2] = l(0, 255 * p(1, P)), q[x + 3] = l(0, 255 * p(1, M));
    }
  return { w: H, h: U, rgba: q };
}
function X(t) {
  let r = t[3], p = t[2] & 128, l = t[4] & 128, u = l ? p ? 5 : 7 : r & 7, c = l ? r & 7 : p ? 5 : 7;
  return u / c;
}
function Y(t, r, p) {
  let l = t * 4 + 1, u = 6 + r * (5 + l), c = [
    137,
    80,
    78,
    71,
    13,
    10,
    26,
    10,
    0,
    0,
    0,
    13,
    73,
    72,
    68,
    82,
    0,
    0,
    t >> 8,
    t & 255,
    0,
    0,
    r >> 8,
    r & 255,
    8,
    6,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    u >>> 24,
    u >> 16 & 255,
    u >> 8 & 255,
    u & 255,
    73,
    68,
    65,
    84,
    120,
    1
  ], _ = [
    0,
    498536548,
    997073096,
    651767980,
    1994146192,
    1802195444,
    1303535960,
    1342533948,
    -306674912,
    -267414716,
    -690576408,
    -882789492,
    -1687895376,
    -2032938284,
    -1609899400,
    -1111625188
  ], n = 1, s = 0;
  for (let y = 0, i = 0, a = l - 1; y < r; y++, a += l - 1)
    for (c.push(y + 1 < r ? 0 : 1, l & 255, l >> 8, ~l & 255, l >> 8 ^ 255, 0), s = (s + n) % 65521; i < a; i++) {
      let o = p[i] & 255;
      c.push(o), n = (n + o) % 65521, s = (s + n) % 65521;
    }
  c.push(
    s >> 8,
    s & 255,
    n >> 8,
    n & 255,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    73,
    69,
    78,
    68,
    174,
    66,
    96,
    130
  );
  for (let [y, i] of [[12, 29], [37, 41 + u]]) {
    let a = -1;
    for (let o = y; o < i; o++)
      a ^= c[o], a = a >>> 4 ^ _[a & 15], a = a >>> 4 ^ _[a & 15];
    a = ~a, c[i++] = a >>> 24, c[i++] = a >> 16 & 255, c[i++] = a >> 8 & 255, c[i++] = a & 255;
  }
  return "data:image/png;base64," + btoa(String.fromCharCode(...c));
}
function Z(t) {
  let r = W(t);
  return Y(r.w, r.h, r.rgba);
}
export {
  Y as rgbaToDataURL,
  X as thumbHashToApproximateAspectRatio,
  Z as thumbHashToDataURL,
  W as thumbHashToRGBA
};
