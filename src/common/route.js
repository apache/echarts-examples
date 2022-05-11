export function getURL(params, raw) {
  const url = new URL(location.href);
  Object.entries(params).forEach(([k, v]) =>
    v == null ? url.searchParams.delete(k) : url.searchParams.set(k, v)
  );
  return raw ? url : url.toString();
}

export function gotoURL(params, pushHistory) {
  if (pushHistory) {
    history.pushState({}, '', getURL(params));
  } else {
    location.href = getURL(params);
  }
}
