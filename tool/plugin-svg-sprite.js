const { RawSource } = require('webpack-sources');
const path = require('path');
const fs = require('fs');

class SvgSpritePlugin {
  constructor(options = {}) {
    this.spriteFilename = options.spriteFilename || 'sprite.svg';
    this.svgPath = options.svgPath;
  }

  // Helper to process raw SVG string into a <symbol>
  processSvg(filePath, rawSvg) {
    const id = path.basename(filePath, '.svg').replace(/[^\w0-9_-]/g, '-');

    // Remove XML declaration and comments
    let svg = rawSvg.replace(/<\?xml.*?\?>/g, '').replace(/<!--.*?-->/gs, '');

    // Extract viewBox (crucial for icon scaling)
    const viewBoxMatch = svg.match(/viewBox="([^"]*)"/);
    if (!viewBoxMatch) {
      console.warn(
        `Warning: SVG file '${filePath}' is missing a viewBox attribute. Skipping.`
      );
      return null;
    }
    const viewBox = viewBoxMatch[1];

    // WARNING: Simple regex is used here. For production, a reliable XML parser is safer.
    const symbolContent = svg
      .replace(/<\/?svg[^>]*>/g, '') // Remove opening/closing <svg> tags
      .replace(/xlink:href/g, 'href') // xlink:href causes parse error and icons do not load
      .replace(/\s+/g, ' ') // Minify: collapse whitespace
      .replace(/>\s+</g, '><') // Minify: remove spaces between tags
      .trim();

    return `<symbol id="${id}" viewBox="${viewBox}">${symbolContent}</symbol>`;
  }

  // Recursively get all .svg files
  getSvgFiles(dir) {
    let files = [];
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        files = files.concat(this.getSvgFiles(fullPath));
      } else if (item.endsWith('.svg')) {
        files.push(fullPath);
      }
    }
    return files;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('SvgSpritePlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'SvgSpritePlugin',
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
        },
        (assets) => {
          if (!this.svgPath || !fs.existsSync(this.svgPath)) {
            return;
          }

          const svgFiles = this.getSvgFiles(this.svgPath);
          let symbols = [];

          for (const filePath of svgFiles) {
            const rawSvg = fs.readFileSync(filePath, 'utf-8');
            const symbol = this.processSvg(filePath, rawSvg);
            if (symbol) {
              symbols.push(symbol);
            }
          }

          // 4. Assemble the final sprite content
          const spriteContent = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${symbols.join(
            '\n'
          )}</svg>`;

          // 5. Emit the single sprite file to the build directory
          compilation.emitAsset(
            this.spriteFilename,
            new RawSource(spriteContent)
          );
        }
      );
    });
  }
}

module.exports = SvgSpritePlugin;
