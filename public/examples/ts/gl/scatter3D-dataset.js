/*
title: 3D Scatter with Dataset
category: scatter3D
titleCN: 使用 dataset 为三维散点图设置数据
*/

$.get(
  ROOT_PATH + '/data/asset/data/life-expectancy-table.json',
  function (data) {
    var symbolSize = 2.5;
    option = {
      grid3D: {},
      xAxis3D: {
        type: 'category'
      },
      yAxis3D: {},
      zAxis3D: {},
      dataset: {
        dimensions: [
          'Income',
          'Life Expectancy',
          'Population',
          'Country',
          { name: 'Year', type: 'ordinal' }
        ],
        source: data
      },
      series: [
        {
          type: 'scatter3D',
          symbolSize: symbolSize,
          encode: {
            x: 'Country',
            y: 'Life Expectancy',
            z: 'Income',
            tooltip: [0, 1, 2, 3, 4]
          }
        }
      ]
    };

    myChart.setOption(option);
  }
);
