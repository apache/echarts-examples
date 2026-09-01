import LazyLoad from 'vanilla-lazyload/dist/lazyload.esm';
import { EXAMPLE_CATEGORIES, BLACK_MAP } from './config';

const icons = {};
[
  'line',
  'bar',
  'scatter',
  'pie',
  'radar',
  'funnel',
  'gauge',
  'map',
  'graph',
  'treemap',
  'parallel',
  'sankey',
  'candlestick',
  'boxplot',
  'heatmap',
  'pictorialBar',
  'themeRiver',
  'calendar',
  'matrix',
  'chord',
  'custom',
  'sunburst',
  'tree',
  'dataset',
  'geo',
  'lines',
  'dataZoom',
  'rich',
  'graphic'
].forEach(function (category) {
  icons[category] = require('../asset/icon/' + category + '.svg');
});

const glIcon = require('../asset/icon/gl.svg');
[
  'globe',
  'bar3D',
  'scatter3D',
  'surface',
  'map3D',
  'lines3D',
  'line3D',
  'scatterGL',
  'linesGL',
  'flowGL',
  'graphGL',
  'geo3D'
].forEach(function (category) {
  icons[category] = glIcon;
});

function defaultErrorCallback(img) {
  const fallbackSrc = img.src;
  const children = img.parentElement.children;
  for (let i = 0, len = children.length; i < len; i++) {
    const el = children[i];
    if (el !== img) {
      el.srcset = fallbackSrc;
    }
  }
}

export function createLazyLoader(options = {}) {
  return new LazyLoad({
    // Container should be the scroll viewport.
    // container: this.$el.querySelector('#explore-container .example-list-panel')
    elements_selector: '.chart-area',
    load_delay: 400,
    class_loaded: 'ec-shot-loaded',
    callback_error: defaultErrorCallback,
    ...options
  });
}

function buildExampleListByCategory(chartList, chartListGL) {
  const exampleListByCategory = {};

  function addExamples(list, isGL) {
    let categoryOrder = 0;

    do {
      let added = false;
      for (let i = 0; i < list.length; i++) {
        const example = list[i];
        if (BLACK_MAP.hasOwnProperty(example.id)) {
          continue;
        }
        if (example.noExplore) {
          continue;
        }
        if (typeof example.category === 'string') {
          example.category = [example.category];
        }

        const categoryStr = (example.category || [])[categoryOrder];
        if (categoryStr) {
          added = true;
          let categoryObj = exampleListByCategory[categoryStr];
          if (!categoryObj) {
            categoryObj = {
              category: categoryStr,
              examples: []
            };
            exampleListByCategory[categoryStr] = categoryObj;
          }
          example.isGL = isGL;
          categoryObj.examples.push(example);
        }
      }

      if (!added) {
        break;
      }
    } while (++categoryOrder && categoryOrder < 4);
  }

  addExamples(chartList, false);
  addExamples(chartListGL, true);

  return exampleListByCategory;
}

function createExampleList(exampleListByCategory) {
  const list = [];
  for (let i = 0, len = EXAMPLE_CATEGORIES.length; i < len; i++) {
    const category = EXAMPLE_CATEGORIES[i];
    const categoryObj = exampleListByCategory[category];
    if (categoryObj && categoryObj.examples.length > 0) {
      list.push({
        category,
        examples: categoryObj.examples
      });
    }
  }
  return list;
}

export { icons, buildExampleListByCategory, createExampleList };
