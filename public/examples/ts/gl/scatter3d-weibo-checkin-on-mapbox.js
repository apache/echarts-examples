/*
title: Weibo checkin on Mapbox
category: scatter3D
titleCN: Weibo checkin on Mapbox
*/

mapboxgl.accessToken = mapboxglToken;

$.getJSON(
  ROOT_PATH + '/asset/get/s/data-1491917776060-Sku0i8qpx.json',
  function (weiboData) {
    weiboData = weiboData.map(function (serieData, idx) {
      var px = serieData[0] / 1000;
      var py = serieData[1] / 1000;
      var res = [[px, py, 1]];

      for (var i = 2; i < serieData.length; i += 2) {
        var dx = serieData[i] / 1000;
        var dy = serieData[i + 1] / 1000;
        var x = px + dx;
        var y = py + dy;
        res.push([x.toFixed(2), y.toFixed(2), 1]);

        px = x;
        py = y;
      }
      return res;
    });

    myChart.setOption({
      mapbox: {
        center: [104.114129, 37.550339],
        zoom: 3,
        pitch: 0,
        bearing: 0,
        style: 'mapbox://styles/mapbox/dark-v9',
        postEffect: {
          enable: true
        },
        light: {
          main: {
            intensity: 2,
            shadow: false,
            shadowQuality: 'high'
          },
          ambient: {
            intensity: 0
          }
        }
      },
      series: [
        {
          name: '弱',
          type: 'scatter3D',
          coordinateSystem: 'mapbox',
          symbolSize: 1,
          itemStyle: {
            shadowBlur: 2,
            shadowColor: 'rgba(37, 140, 249, 0.8)',
            color: 'rgba(37, 140, 249, 0.8)'
          },
          data: weiboData[0]
        },
        {
          name: '中',
          type: 'scatter3D',
          coordinateSystem: 'mapbox',
          symbolSize: 1,
          itemStyle: {
            shadowBlur: 2,
            shadowColor: 'rgba(14, 241, 242, 0.8)',
            color: 'rgba(14, 241, 242, 0.8)'
          },
          data: weiboData[1]
        },
        {
          name: '强',
          type: 'scatter3D',
          coordinateSystem: 'mapbox',
          symbolSize: 1,
          itemStyle: {
            shadowBlur: 2,
            shadowColor: 'rgba(255, 255, 255, 0.8)',
            color: 'rgba(255, 255, 255, 0.8)'
          },
          data: weiboData[2]
        }
      ]
    });
  }
);
