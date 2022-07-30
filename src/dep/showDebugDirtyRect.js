const DebugRect = (function () {
  function DebugRect(style) {
    const dom = (this.dom = document.createElement('div'));
    dom.className = 'ec-debug-dirty-rect';
    style = Object.assign({}, style);
    Object.assign(style, {
      backgroundColor: 'rgba(0, 0, 255, 0.2)',
      border: '1px solid #00f'
    });
    dom.style.cssText =
      'position:absolute;opacity:0;transition:opacity 0.5s linear;pointer-events:none;';
    for (const key in style) {
      if (style.hasOwnProperty(key)) {
        dom.style[key] = style[key];
      }
    }
  }
  DebugRect.prototype.update = function (rect) {
    const domStyle = this.dom.style;
    domStyle.width = rect.width + 'px';
    domStyle.height = rect.height + 'px';
    domStyle.left = rect.x + 'px';
    domStyle.top = rect.y + 'px';
  };
  DebugRect.prototype.hide = function () {
    this.dom.style.opacity = '0';
  };
  DebugRect.prototype.show = function () {
    const _this = this;
    clearTimeout(this._hideTimeout);
    this.dom.style.opacity = '1';
    this._hideTimeout = setTimeout(function () {
      _this.hide();
    }, 500);
  };
  return DebugRect;
})();

function showDebugDirtyRect(zr, opts) {
  opts = opts || {};
  const painter = zr.painter;
  if (!painter.getLayers) {
    throw new Error('Debug dirty rect can only been used on canvas renderer.');
  }
  if (painter.isSingleCanvas()) {
    throw new Error(
      'Debug dirty rect can only been used on zrender inited with container.'
    );
  }
  const debugViewRoot = document.createElement('div');
  debugViewRoot.className = 'ec-debug-dirty-rect-container';
  debugViewRoot.style.cssText =
    'position:absolute;left:0;top:0;right:0;bottom:0;pointer-events:none;z-index:9999999;';
  const debugRects = [];
  const dom = zr.dom;
  dom.appendChild(debugViewRoot);
  var computedStyle = getComputedStyle(dom);
  if (computedStyle.position === 'static') {
    dom.style.position = 'relative';
  }
  zr.on('rendered', function () {
    if (painter.getLayers) {
      let idx_1 = 0;
      painter.eachBuiltinLayer(function (layer) {
        if (!layer.debugGetPaintRects) {
          return;
        }
        const paintRects = layer.debugGetPaintRects();
        for (let i = 0; i < paintRects.length; i++) {
          if (!debugRects[idx_1]) {
            debugRects[idx_1] = new DebugRect(opts.style);
            debugViewRoot.appendChild(debugRects[idx_1].dom);
          }
          debugRects[idx_1].show();
          debugRects[idx_1].update(paintRects[i]);
          idx_1++;
        }
      });
      for (let i = idx_1; i < debugRects.length; i++) {
        debugRects[i].hide();
      }
    }
  });
}
