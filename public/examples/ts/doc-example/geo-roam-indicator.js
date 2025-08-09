/*
title: geo roam indicator demo
noExplore: true
since: 6.0.0
*/

function updateChart() {
  option = {
    title: {
      text: 'Drag or pinch to roam the map'
    },
    tooltip: {},
    geo: {
      id: 'my_geo',
      map: 'iceland',
      aspectScale: Math.cos((65 * Math.PI) / 180), // 65 is Iceland's approximate latitude.
      animation: false,

      preserveAspect: app.config.preserveAspect,
      preserveAspectAlign: app.config.preserveAspectAlign,
      preserveAspectVerticalAlign: app.config.preserveAspectVerticalAlign,
      clip: app.config.clip,

      // These props determine a rectangular area for the geo component:
      left: app.config['geo.left'],
      right: app.config['geo.right'],
      top: app.config['geo.top'],
      bottom: app.config['geo.bottom'],

      // Roaming related props:
      roam: true,
      // Note: if `clip: true; roamTrigger: 'global'`,
      //  roaming can only be triggered inside the clip area.
      roamTrigger: app.config.roamTrigger,
      // center and zoom:
      center: [
        app.config['geo.center[0]%'] + '%',
        app.config['geo.center[1]%'] + '%'
      ],
      zoom: app.config['geo.zoom']
    }
  };

  function handleFinished() {
    myChart.off('finished', handleFinished);
    setTimeout(function () {
      updateIndicators();
    }, 0);
  }
  myChart.on('finished', handleFinished);

  myChart.setOption(option);
}

function initChart() {
  myChart.on('georoam', function () {
    updateIndicators();
  });
  window.addEventListener('resize', function () {
    updateIndicators();
  });

  updateChart();
}

/**
 * The rectangular indicators for tutorial purposes:
 *  - `geo_allocated_rect`:
 *    Determined by `geo.left`/`.right`/`.top`/`.bottom`/`.width`/`.height`/`.aspectScale`.
 *  - `geo_view_rect`:
 *    Determined by `geo_allocated_rect`
 *      and `geo.preserveAspect`/`.preserveAspectAlign`/`.preserveAspectVerticalAlign`.
 *  - `geo_content_bounding_rect`:
 *    Determined by `geo.map`/`.projection`/`.center`/`.zoom`.
 */
function updateIndicators() {
  if (!_indicatorInfraRegistered) {
    _indicatorInfraRegistered = true;
    echarts.registerMap('geo_allocated_rect_indicator_fake_map', {
      geoJSON: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [0, 0],
                  [0, 100],
                  [100, 100],
                  [100, 0]
                ]
              ]
            },
            properties: {
              name: 'geo_allocated_rect (determined by geo.left/right/top/bottom)',
              cp: [50, 98]
            }
          }
        ]
      }
    });
  }

  var ignore = !app.config.showRectIndicators;
  var indicatorRects = app.__internalAPI.retrieveViewCoordSysRects(myChart, {
    mainType: 'geo',
    id: 'my_geo'
  });

  var colors = ['#3B82F6', '#10B981', '#F59E0B'];

  var indicatorsOption = {
    // Tricky: Use another geo component just as an indicator for convenience.
    geo: {
      id: 'geo_allocated_rect_indicator',
      map: 'geo_allocated_rect_indicator_fake_map',
      aspectScale: 1,
      roam: false,
      zoom: 1,
      silent: true,
      itemStyle: {
        borderColor: colors[0],
        borderWidth: 1,
        borderType: 'dashed',
        color: 'transparent'
      },
      label: {
        show: true,
        padding: 2,
        color: colors[0],
        borderColor: '#fff',
        lineWidth: 2
      },
      z: -12,
      show: !ignore,

      left: app.config['geo.left'],
      right: app.config['geo.right'],
      top: app.config['geo.top'],
      bottom: app.config['geo.bottom']
    },
    graphic: {
      elements: [
        {
          id: 'geo_view_rect_indicator',
          type: 'rect',
          silent: true,
          z: -9,
          style: {
            // fill: '#e0e0e0',
            fill: 'none',
            stroke: colors[1],
            lineWidth: 1,
            lineDash: 'dashed'
          },
          textContent: {
            type: 'text',
            style: {
              text: 'geo_view_rect\n(determined by applying `preserveAspect` to geo_allocated_rect)',
              fill: colors[1],
              padding: 2,
              stroke: '#fff',
              lineWidth: 2,
              fontSize: 12
            },
            z: -8
          },
          textConfig: {
            position: 'insideTopLeft'
          },
          ignore: ignore,
          shape: indicatorRects.viewRect
        },
        {
          id: 'geo_content_bounding_rect_indicator',
          type: 'rect',
          silent: true,
          z: -6,
          style: {
            fill: 'none',
            stroke: colors[2],
            lineWidth: 1,
            lineDash: 'dashed'
          },
          textContent: {
            type: 'text',
            style: {
              text: 'geo_content_bounding_rect',
              fill: colors[2],
              padding: 2,
              stroke: '#fff',
              lineWidth: 2,
              fontSize: 12
            },
            z: -5
          },
          textConfig: {
            position: 'insideTop'
          },
          ignore: ignore,
          shape: indicatorRects.contentBoundingRect
        }
      ]
    }
  }; // End of indicatorsOption

  myChart.setOption(indicatorsOption);
}
var _indicatorInfraRegistered = false;

/**
 * Note: The floating control panel are not relevant to echarts API,
 *  just for illustration purposes.
 */
function initFloatingControlPanelAndContext() {
  app.config = {};

  app.configParameters = {};
  app.config.showRectIndicators = true;
  app.configParameters.showRectIndicators = { options: [true, false] };
  app.config.clip = true;
  app.configParameters.clip = { options: [true, false] };
  app.config.preserveAspect = true;
  app.configParameters.preserveAspect = {
    options: [true, false, 'contain', 'cover']
  };
  app.config.preserveAspectAlign = 'center';
  app.configParameters.preserveAspectAlign = {
    options: ['center', 'left', 'right']
  };
  app.config.preserveAspectVerticalAlign = 'middle';
  app.configParameters.preserveAspectVerticalAlign = {
    options: ['middle', 'top', 'bottom']
  };
  app.config.roamTrigger = 'selfRect';
  app.configParameters.roamTrigger = { options: ['selfRect', 'global'] };
  app.config['geo.left'] = 100;
  app.configParameters['geo.left'] = { min: 0, max: 500 };
  app.config['geo.right'] = 100;
  app.configParameters['geo.right'] = { min: 0, max: 500 };
  app.config['geo.top'] = 100;
  app.configParameters['geo.top'] = { min: 0, max: 500 };
  app.config['geo.bottom'] = 100;
  app.configParameters['geo.bottom'] = { min: 0, max: 500 };
  app.config['geo.center[0]%'] = 50;
  app.configParameters['geo.center[0]%'] = { min: 0, max: 100 };
  app.config['geo.center[1]%'] = 50;
  app.configParameters['geo.center[1]%'] = { min: 0, max: 100 };
  app.config['geo.zoom'] = 1;
  app.configParameters['geo.zoom'] = { min: 0.1, max: 10, step: 0.1 };

  app.config.onChange = function () {
    updateChart();
  };
}

initFloatingControlPanelAndContext();

myChart.showLoading();
$.get(ROOT_PATH + '/data/asset/geo/iceland.geo.json', function (geoJSON) {
  myChart.hideLoading();

  echarts.registerMap('iceland', geoJSON);

  initChart();
});
