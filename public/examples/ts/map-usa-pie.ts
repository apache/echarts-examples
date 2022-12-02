/*
title: Pie Charts on GEO Map
category: map, pie
titleCN: 在地图上显示饼图
*/

// This example requires ECharts v5.4.0 or later

myChart.showLoading();

$.get(ROOT_PATH + '/data/asset/geo/USA.json', function (usaJson) {
  echarts.registerMap('USA', usaJson, {
    Alaska: {
      left: -131,
      top: 25,
      width: 15
    },
    Hawaii: {
      left: -110,
      top: 28,
      width: 5
    },
    'Puerto Rico': {
      left: -76,
      top: 26,
      width: 2
    }
  });

  function randomPieSeries(
    center: string | number[],
    radius: number
  ): echarts.PieSeriesOption {
    const data = ['A', 'B', 'C', 'D'].map((t) => {
      return {
        value: Math.round(Math.random() * 100),
        name: 'Category ' + t
      };
    });
    return {
      type: 'pie',
      coordinateSystem: 'geo',
      tooltip: {
        formatter: '{b}: {c} ({d}%)'
      },
      label: {
        show: false
      },
      labelLine: {
        show: false
      },
      animationDuration: 0,
      radius,
      center,
      data
    };
  }

  option = {
    geo: {
      map: 'USA',
      roam: true,
      itemStyle: {
        areaColor: '#e7e8ea'
      }
    },
    tooltip: {},
    legend: {},
    series: [
      randomPieSeries([-86.753504, 33.01077], 15),
      randomPieSeries([-116.853504, 39.8], 25),
      randomPieSeries([-99, 31.5], 30),
      randomPieSeries(
        // it's also supported to use geo region name as center since v5.4.1
        +echarts.version.split('.').slice(0, 3).join('') > 540
          ? 'Maine'
          : // or you can only use the LngLat array
            [-69, 45.5],
        12
      )
    ]
  };

  myChart.hideLoading();
  myChart.setOption(option);
});

export {};
