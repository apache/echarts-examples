self.addEventListener('message', (e) => {
  const { reqId, args, body } = e.data;
  console.log('worker received xhr task', args);
  const xhr = new XMLHttpRequest();
  xhr.open.apply(xhr, args);
  // PENDING
  xhr.responseType = 'arraybuffer';
  xhr.onload = xhr.onerror = (e) => {
    console.log('worker xhr task result', e.type, e);
    self.postMessage({
      res: xhr.response,
      reqId,
      type: e.type
    });
  };
  xhr.send(body);
});
