function t(r) {
  return (o) => {
    r.forEach((e) => {
      typeof e == "function" ? e(o) : e != null && (e.current = o);
    });
  };
}
export {
  t as mergeRefs
};
