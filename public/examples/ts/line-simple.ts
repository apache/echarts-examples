/*
title: Basic Line Chart
category: line
titleCN: 基础折线图
difficulty: 0
*/

option = {
  tooltip: {
  trigger: 'axis',
  triggerOn: 'click',
  axisPointer:{
    type: 'line'
  }
},
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line',
      emphasis:{
        focus:'series'
      }
    }
  ]
};

export {};
