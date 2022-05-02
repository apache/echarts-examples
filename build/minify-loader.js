const { minify } = require('terser');

module.exports = function minifyLoader(source, map, meta) {
  if (this.mode !== 'production') {
    return source;
  }
  const callback = this.async();
  /** @type {import('terser').MinifyOptions} */
  const options = this.getOptions();
  minify(source, options)
    .then((result) => callback(null, result.code, result.map, meta))
    .catch(callback);
};
