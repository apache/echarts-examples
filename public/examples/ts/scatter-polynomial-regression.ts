/*
title: Polynomial Regression
category: scatter
titleCN: 多项式回归（使用统计插件）
difficulty: 2
*/

// See https://github.com/ecomfe/echarts-stat
echarts.registerTransform(ecStat.transform.regression);

const data = [
  [96.24, 11.35],
  [33.09, 85.11],
  [57.6, 36.61],
  [36.77, 27.26],
  [20.1, 6.72],
  [45.53, 36.37],
  [110.07, 80.13],
  [72.05, 20.88],
  [39.82, 37.15],
  [48.05, 70.5],
  [0.85, 2.57],
  [51.66, 63.7],
  [61.07, 127.13],
  [64.54, 33.59],
  [35.5, 25.01],
  [226.55, 664.02],
  [188.6, 175.31],
  [81.31, 108.68]
];

option = {
  dataset: [
    {
      source: data
    },
    {
      transform: {
        type: 'ecStat:regression',
        config: { method: 'polynomial', order: 3 }
      }
    }
  ],
  title: {
    text: '18 companies net profit and main business income (million)',
    subtext: 'By ecStat.regression',
    sublink: 'https://github.com/ecomfe/echarts-stat',
    left: 'center',
    top: 16
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  xAxis: {
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    },
    splitNumber: 20
  },
  yAxis: {
    min: -40,
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
  },
  series: [
    {
      name: 'scatter',
      type: 'scatter'
    },
    {
      name: 'line',
      type: 'line',
      smooth: true,
      datasetIndex: 1,
      symbolSize: 0.1,
      symbol: 'circle',
      label: { show: true, fontSize: 16 },
      labelLayout: { dx: -20 },
      encode: { label: 2, tooltip: 1 }
    }
  ]
};

export {};
