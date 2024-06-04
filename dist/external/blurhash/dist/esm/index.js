var C = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "#", "$", "%", "*", "+", ",", "-", ".", ":", ";", "=", "?", "@", "[", "]", "^", "_", "{", "|", "}", "~"], i = (t) => {
  let r = 0;
  for (let a = 0; a < t.length; a++) {
    let l = t[a], o = C.indexOf(l);
    r = r * 83 + o;
  }
  return r;
}, b = (t) => {
  let r = t / 255;
  return r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
}, d = (t) => {
  let r = Math.max(0, Math.min(1, t));
  return r <= 31308e-7 ? Math.trunc(r * 12.92 * 255 + 0.5) : Math.trunc((1.055 * Math.pow(r, 0.4166666666666667) - 0.055) * 255 + 0.5);
}, T = (t) => t < 0 ? -1 : 1, m = (t, r) => T(t) * Math.pow(Math.abs(t), r), y = class extends Error {
  constructor(t) {
    super(t), this.name = "ValidationError", this.message = t;
  }
}, U = (t) => {
  if (!t || t.length < 6)
    throw new y("The blurhash string must be at least 6 characters");
  let r = i(t[0]), a = Math.floor(r / 9) + 1, l = r % 9 + 1;
  if (t.length !== 4 + 2 * l * a)
    throw new y(`blurhash length mismatch: length is ${t.length} but it should be ${4 + 2 * l * a}`);
}, $ = (t) => {
  let r = t >> 16, a = t >> 8 & 255, l = t & 255;
  return [b(r), b(a), b(l)];
}, j = (t, r) => {
  let a = Math.floor(t / 361), l = Math.floor(t / 19) % 19, o = t % 19;
  return [m((a - 9) / 9, 2) * r, m((l - 9) / 9, 2) * r, m((o - 9) / 9, 2) * r];
}, q = (t, r, a, l) => {
  U(t), l = l | 1;
  let o = i(t[0]), p = Math.floor(o / 9) + 1, c = o % 9 + 1, I = (i(t[1]) + 1) / 166, u = new Array(c * p);
  for (let e = 0; e < u.length; e++)
    if (e === 0) {
      let h = i(t.substring(2, 6));
      u[e] = $(h);
    } else {
      let h = i(t.substring(4 + e * 2, 6 + e * 2));
      u[e] = j(h, I * l);
    }
  let n = r * 4, s = new Uint8ClampedArray(n * a);
  for (let e = 0; e < a; e++)
    for (let h = 0; h < r; h++) {
      let x = 0, v = 0, E = 0;
      for (let M = 0; M < p; M++)
        for (let f = 0; f < c; f++) {
          let g = Math.cos(Math.PI * h * f / r) * Math.cos(Math.PI * e * M / a), w = u[f + M * c];
          x += w[0] * g, v += w[1] * g, E += w[2] * g;
        }
      let P = d(x), V = d(v), A = d(E);
      s[4 * h + 0 + e * n] = P, s[4 * h + 1 + e * n] = V, s[4 * h + 2 + e * n] = A, s[4 * h + 3 + e * n] = 255;
    }
  return s;
}, z = q;
export {
  y as ValidationError,
  z as decode
};
