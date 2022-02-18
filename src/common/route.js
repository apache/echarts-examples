export function getURL(params) {
  const searchUrlParts = [];
  for (let key in params) {
    if (params.hasOwnProperty(key)) {
      let part = key;
      if (params[key] != null) {
        part += '=' + params[key];
      }
      searchUrlParts.push(part);
    }
  }
  const searchUrl = searchUrlParts.join('&');

  return (
    location.protocol +
    '//' +
    location.hostname +
    (location.port ? ':' + location.port : '') +
    location.pathname +
    (searchUrl ? '?' + searchUrl : '')
  );
}

export function gotoURL(params, pushHistory) {
  if (pushHistory) {
    history.pushState({}, '', getURL(params));
  } else {
    location.href = getURL(params);
  }
}
