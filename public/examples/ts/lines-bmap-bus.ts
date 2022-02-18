/*
title: Bus Lines of Beijing - Baidu Map
category: 'map, lines'
tags: bmap
titleCN: 北京公交路线 - 百度地图
*/

$.get(ROOT_PATH + '/data/asset/data/lines-bus.json', function (data) {
  let busLines = [].concat.apply(
    [],
    data.map(function (busLine: number[], idx: number) {
      let prevPt: number[] = [];
      let points: number[][] = [];
      for (let i = 0; i < busLine.length; i += 2) {
        let pt = [busLine[i], busLine[i + 1]];
        if (i > 0) {
          pt = [prevPt[0] + pt[0], prevPt[1] + pt[1]];
        }
        prevPt = pt;

        points.push([pt[0] / 1e4, pt[1] / 1e4]);
      }
      return {
        coords: points
      };
    })
  );
  myChart.setOption(
    (option = {
      bmap: {
        center: [116.46, 39.92],
        zoom: 10,
        roam: true,
        mapStyle: {
          styleJson: [
            {
              featureType: 'water',
              elementType: 'all',
              stylers: {
                color: '#d1d1d1'
              }
            },
            {
              featureType: 'land',
              elementType: 'all',
              stylers: {
                color: '#f3f3f3'
              }
            },
            {
              featureType: 'railway',
              elementType: 'all',
              stylers: {
                visibility: 'off'
              }
            },
            {
              featureType: 'highway',
              elementType: 'all',
              stylers: {
                color: '#fdfdfd'
              }
            },
            {
              featureType: 'highway',
              elementType: 'labels',
              stylers: {
                visibility: 'off'
              }
            },
            {
              featureType: 'arterial',
              elementType: 'geometry',
              stylers: {
                color: '#fefefe'
              }
            },
            {
              featureType: 'arterial',
              elementType: 'geometry.fill',
              stylers: {
                color: '#fefefe'
              }
            },
            {
              featureType: 'poi',
              elementType: 'all',
              stylers: {
                visibility: 'off'
              }
            },
            {
              featureType: 'green',
              elementType: 'all',
              stylers: {
                visibility: 'off'
              }
            },
            {
              featureType: 'subway',
              elementType: 'all',
              stylers: {
                visibility: 'off'
              }
            },
            {
              featureType: 'manmade',
              elementType: 'all',
              stylers: {
                color: '#d1d1d1'
              }
            },
            {
              featureType: 'local',
              elementType: 'all',
              stylers: {
                color: '#d1d1d1'
              }
            },
            {
              featureType: 'arterial',
              elementType: 'labels',
              stylers: {
                visibility: 'off'
              }
            },
            {
              featureType: 'boundary',
              elementType: 'all',
              stylers: {
                color: '#fefefe'
              }
            },
            {
              featureType: 'building',
              elementType: 'all',
              stylers: {
                color: '#d1d1d1'
              }
            },
            {
              featureType: 'label',
              elementType: 'labels.text.fill',
              stylers: {
                color: '#999999'
              }
            }
          ]
        }
      },
      series: [
        {
          type: 'lines',
          coordinateSystem: 'bmap',
          polyline: true,
          data: busLines,
          silent: true,
          lineStyle: {
            color: 'rgb(200, 35, 45)',
            opacity: 0.2,
            width: 1
          },
          progressiveThreshold: 500,
          progressive: 200
        }
      ]
    })
  );
});

export {};
