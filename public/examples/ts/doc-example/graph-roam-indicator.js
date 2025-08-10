/*
title: graph roam indicator demo
noExplore: true
since: 6.0.0
*/

function updateChart() {
  option = {
    title: {
      text: 'Drag or pinch to roam the graph'
    },
    tooltip: {},
    series: {
      id: 'my_graph',
      type: 'graph',

      animation: false,

      // `preserveXxx` requires echarts v6.0.0+.
      preserveAspect: app.config.preserveAspect,
      preserveAspectAlign: app.config.preserveAspectAlign,
      preserveAspectVerticalAlign: app.config.preserveAspectVerticalAlign,

      // These props determine a rectangular area for the graph series:
      left: app.config['series.left'],
      right: app.config['series.right'],
      top: app.config['series.top'],
      bottom: app.config['series.bottom'],

      // Roaming related props:
      roam: true,
      // `roamTrigger` requires echarts v6.0.0+.
      roamTrigger: app.config.roamTrigger,
      center: [
        app.config['series.center[0]%'] + '%',
        app.config['series.center[1]%'] + '%'
      ],
      zoom: app.config['series.zoom'],

      // Other style props:
      symbolSize: 35,
      label: { show: true },
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 15],
      lineStyle: { opacity: 1, width: 2 },

      data: [
        { name: 'node_1', x: 300, y: 200 },
        { name: 'node_2', x: 800, y: 200 },
        { name: 'node_3', x: 700, y: 100 },
        { name: 'node_4', x: 400, y: 300 }
      ],
      edges: [
        { source: 'node_1', target: 'node_2' },
        { source: 'node_1', target: 'node_3' },
        { source: 'node_2', target: 'node_3' },
        { source: 'node_2', target: 'node_4' },
        { source: 'node_1', target: 'node_4' }
      ]
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
  myChart.on('graphroam', function () {
    updateIndicators();
  });
  window.addEventListener('resize', function () {
    updateIndicators();
  });

  updateChart();
}

/**
 * The rectangular indicators for tutorial purposes:
 *  - `graph_allocated_rect`:
 *    Determined by `series[type='graph'].left`/`.right`/`.top`/`.bottom`/`.width`/`.height`.
 *  - `graph_view_rect`:
 *    Determined by `graph_allocated_rect`
 *      and `series[type='graph'].preserveAspect`/`.preserveAspectAlign`/`.preserveAspectVerticalAlign`.
 *  - `graph_content_bounding_rect`:
 *    Determined by `series[type='graph'].center`/`.zoom`.
 */
function updateIndicators() {
  var ignore = !app.config.showRectIndicators;
  var indicatorRects = app.__internalAPI.retrieveViewCoordSysRects(myChart, {
    mainType: 'series',
    subType: 'graph',
    id: 'my_graph'
  });

  var colors = ['#3B82F6', '#10B981', '#F59E0B'];

  var indicatorsOption = {
    // Tricky: Use a matrix component just as an indicator for convenience.
    matrix: {
      id: 'graph_allocated_rect_indicator',
      left: app.config['series.left'],
      right: app.config['series.right'],
      top: app.config['series.top'],
      bottom: app.config['series.bottom'],
      backgroundStyle: {
        opacity: ignore ? 0 : 1,
        borderType: 'dashed',
        borderColor: colors[0]
      },
      x: { data: ['x'], show: false },
      y: { data: ['y'], show: false },
      body: {
        itemStyle: { opacity: ignore ? 0 : 1 },
        data: [
          {
            value:
              'graph_allocated_rect (determined by series.left/right/top/bottom/width/height)',
            label: {
              position: 'insideTopLeft',
              padding: 2,
              color: colors[0],
              borderColor: '#fff',
              lineWidth: 2,
              opacity: ignore ? 0 : 1
            },
            coord: [0, 0]
          }
        ]
      }
    },
    graphic: {
      elements: [
        {
          id: 'graph_view_rect_indicator',
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
              text: 'graph_view_rect\n(determined by applying `preserveAspect` to graph_allocated_rect)',
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
          id: 'graph_content_bounding_rect_indicator',
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
              text: 'graph_content_bounding_rect',
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

/**
 * Note: The floating control panel are not relevant to echarts API,
 *  just for illustration purposes.
 */
function initFloatingControlPanelAndContext() {
  app.config = {};

  app.configParameters = {};
  app.config.showRectIndicators = true;
  app.configParameters.showRectIndicators = { options: [true, false] };
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
  app.config['series.left'] = 100;
  app.configParameters['series.left'] = { min: 0, max: 500 };
  app.config['series.right'] = 100;
  app.configParameters['series.right'] = { min: 0, max: 500 };
  app.config['series.top'] = 100;
  app.configParameters['series.top'] = { min: 0, max: 500 };
  app.config['series.bottom'] = 100;
  app.configParameters['series.bottom'] = { min: 0, max: 500 };
  app.config['series.center[0]%'] = 50;
  app.configParameters['series.center[0]%'] = { min: 0, max: 100 };
  app.config['series.center[1]%'] = 50;
  app.configParameters['series.center[1]%'] = { min: 0, max: 100 };
  app.config['series.zoom'] = 1;
  app.configParameters['series.zoom'] = { min: 0.1, max: 10, step: 0.1 };

  app.config.onChange = function () {
    updateChart();
  };
}

initFloatingControlPanelAndContext();
setTimeout(function () {
  initChart();
}, 0);
