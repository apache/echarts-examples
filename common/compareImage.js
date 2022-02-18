const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

function readPNG(path) {
  return new Promise((resolve) => {
    fs.createReadStream(path)
      .pipe(new PNG())
      .on('parsed', function () {
        resolve({
          data: this.data,
          width: this.width,
          height: this.height
        });
      });
  });
}

module.exports.compareImage = function (
  targetPath,
  sourcePath,
  threshold = 0.1
) {
  if (!fs.existsSync(targetPath)) {
    return true;
  }

  return Promise.all([readPNG(targetPath), readPNG(sourcePath)]).then(
    ([expectedImg, actualImg]) => {
      let width = expectedImg.width;
      let height = expectedImg.height;
      if (width !== actualImg.width || height !== actualImg.height) {
        return { diffRatio: 1 };
      }
      const diffPNG = new PNG({ width, height });
      let diffPixelsCount = pixelmatch(
        expectedImg.data,
        actualImg.data,
        diffPNG.data,
        width,
        height,
        {
          threshold
        }
      );
      let totalPixelsCount = width * height;

      return {
        diffRatio: diffPixelsCount / totalPixelsCount,
        diffPNG
      };
    }
  );
};
