/*
title: Simple Gauge
titleCN: 带标签数字动画的基础仪表盘
category: gauge
difficulty: 1
videoStart: 0
videoEnd: 1000
*/

option = {
  tooltip: {
    formatter: '{a} <br/>{b} : {c}%'
  },
  series: [
    {
      name: 'Pressure',
      type: 'gauge',
      progress: {
        show: true
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}'
      },
      data: [
        {
          value: 50,
          name: 'SCORE'
        }
      ]
    }
  ]
};

export {};
