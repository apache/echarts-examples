/*
title: Geo Graph
category: map, graph
titleCN: 地理坐标系上的关系图
*/

function createChart() {
  var chRoughLatitude = 47;
  option = {
    title: {
      text: 'Travel Routes',
    },
    geo: {
      map: 'ch',
      roam: true,
      aspectScale: Math.cos(chRoughLatitude * Math.PI / 180),
      // nameProperty: 'name_en', // If using en name.
      label: {
        show: true,
        textBorderColor: '#fff',
        textBorderWidth: 2,
      }
    },
    tooltip: {},
    series: [
      {
        type: 'graph',
        coordinateSystem: 'geo',
        data: [
          {name: 'a', value: [7.667821250000001, 46.791734269956265]},
          {name: 'b', value: [7.404848750000001, 46.516308805996054]},
          {name: 'c', value: [7.376673125000001, 46.24728858538375]},
          {name: 'd', value: [8.015320625000001, 46.39460918238572]},
          {name: 'e', value: [8.616400625, 46.7020608630855]},
          {name: 'f', value: [8.869981250000002, 46.37539345234199]},
          {name: 'g', value: [9.546196250000001, 46.58676648282309]},
          {name: 'h', value: [9.311399375, 47.182454114178896]},
          {name: 'i', value: [9.085994375000002, 47.55395822835779]},
          {name: 'j', value: [8.653968125000002, 47.47709530818285]},
          {name: 'k', value: [8.203158125000002, 47.44506909144329]},
        ],
        edges: [{
          source: 'a', target: 'b',
        }, {
          source: 'b', target: 'c',
        }, {
          source: 'c', target: 'd',
        }, {
          source: 'd', target: 'e',
        }, {
          source: 'e', target: 'f',
        }, {
          source: 'f', target: 'g',
        }, {
          source: 'g', target: 'h',
        }, {
          source: 'h', target: 'i',
        }, {
          source: 'i', target: 'j',
        }, {
          source: 'j', target: 'k',
        }],
        edgeSymbol: ['none', 'arrow'],
        edgeSymbolSize: 5,
        lineStyle: {
          color: '#718adbff',
          opacity: 1,
        }
      },
    ]
  };
  myChart.setOption(option);
}

function fetchGeoJSON() {
  myChart.showLoading();
  $.get(ROOT_PATH + '/data/asset/geo/ch.geo.json', function (geoJSON) {
    echarts.registerMap('ch', geoJSON);
    createChart();
    myChart.hideLoading();
  });
}

fetchGeoJSON();

export {};
