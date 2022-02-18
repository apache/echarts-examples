/*
title: Airline on Globe
category: lines3D
titleCN: Airline on Globe
*/

$.getJSON(ROOT_PATH + '/data-gl/asset/data/flights.json', function (data) {
  function getAirportCoord(idx) {
    return [data.airports[idx][3], data.airports[idx][4]];
  }
  var routes = data.routes.map(function (airline) {
    return [getAirportCoord(airline[1]), getAirportCoord(airline[2])];
  });

  myChart.setOption({
    backgroundColor: '#000',
    globe: {
      baseTexture: ROOT_PATH + '/data-gl/asset/world.topo.bathy.200401.jpg',
      heightTexture:
        ROOT_PATH + '/data-gl/asset/bathymetry_bw_composite_4k.jpg',

      shading: 'lambert',

      light: {
        ambient: {
          intensity: 0.4
        },
        main: {
          intensity: 0.4
        }
      },

      viewControl: {
        autoRotate: false
      }
    },
    series: {
      type: 'lines3D',

      coordinateSystem: 'globe',

      blendMode: 'lighter',

      lineStyle: {
        width: 1,
        color: 'rgb(50, 50, 150)',
        opacity: 0.1
      },

      data: routes
    }
  });
});
