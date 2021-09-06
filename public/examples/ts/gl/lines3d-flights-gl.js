/*
title: Flights GL
category: lines3D
titleCN: Flights GL
videoStart: 2000
videoEnd: 8000
*/

var uploadedDataURL = ROOT_PATH + '/data-gl/asset/data/flights.json';

myChart.showLoading();

$.getJSON(uploadedDataURL, function (data) {
  myChart.hideLoading();

  function getAirportCoord(idx) {
    return [data.airports[idx][3], data.airports[idx][4]];
  }
  var routes = data.routes.map(function (airline) {
    return [getAirportCoord(airline[1]), getAirportCoord(airline[2])];
  });

  myChart.setOption({
    geo3D: {
      map: 'world',
      shading: 'realistic',
      silent: true,
      environment: '#333',
      realisticMaterial: {
        roughness: 0.8,
        metalness: 0
      },
      postEffect: {
        enable: true
      },
      groundPlane: {
        show: false
      },
      light: {
        main: {
          intensity: 1,
          alpha: 30
        },
        ambient: {
          intensity: 0
        }
      },
      viewControl: {
        distance: 70,
        alpha: 89,

        panMouseButton: 'left',
        rotateMouseButton: 'right'
      },

      itemStyle: {
        color: '#000'
      },

      regionHeight: 0.5
    },
    series: [
      {
        type: 'lines3D',

        coordinateSystem: 'geo3D',

        effect: {
          show: true,
          trailWidth: 1,
          trailOpacity: 0.5,
          trailLength: 0.2,
          constantSpeed: 5
        },

        blendMode: 'lighter',

        lineStyle: {
          width: 0.2,
          opacity: 0.05
        },

        data: routes
      }
    ]
  });

  window.addEventListener('keydown', function () {
    myChart.dispatchAction({
      type: 'lines3DToggleEffect',
      seriesIndex: 0
    });
  });
});
