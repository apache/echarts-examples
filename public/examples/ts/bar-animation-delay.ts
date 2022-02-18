/*
title: Animation Delay
titleCN: 柱状图动画延迟
category: bar
difficulty: 5
*/

var xAxisData = [];
var data1 = [];
var data2 = [];
for (var i = 0; i < 100; i++) {
  xAxisData.push('A' + i);
  data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
  data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
}

option = {
  title: {
    text: 'Bar Animation Delay'
  },
  legend: {
    data: ['bar', 'bar2']
  },
  toolbox: {
    // y: 'bottom',
    feature: {
      magicType: {
        type: ['stack']
      },
      dataView: {},
      saveAsImage: {
        pixelRatio: 2
      }
    }
  },
  tooltip: {},
  xAxis: {
    data: xAxisData,
    splitLine: {
      show: false
    }
  },
  yAxis: {},
  series: [
    {
      name: 'bar',
      type: 'bar',
      data: data1,
      emphasis: {
        focus: 'series'
      },
      animationDelay: function (idx) {
        return idx * 10;
      }
    },
    {
      name: 'bar2',
      type: 'bar',
      data: data2,
      emphasis: {
        focus: 'series'
      },
      animationDelay: function (idx) {
        return idx * 10 + 100;
      }
    }
  ],
  animationEasing: 'elasticOut',
  animationDelayUpdate: function (idx) {
    return idx * 5;
  }
};
