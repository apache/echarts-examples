/*
title: Waterfall Chart
titleCN: 阶梯瀑布图（柱状图模拟）
category: bar
difficulty: 3
*/

option = {
  title: {
    text: 'Accumulated Waterfall Chart'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: function (params: any) {
      let tar;
      if (params[1].value !== '-') {
        tar = params[1];
      } else {
        tar = params[0];
      }
      return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
    }
  },
  legend: {
    data: ['支出', '收入']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    splitLine: { show: false },
    data: (function () {
      var list = [];
      for (var i = 1; i <= 11; i++) {
        list.push('11月' + i + '日');
      }
      return list;
    })()
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '辅助',
      type: 'bar',
      stack: 'Total',
      itemStyle: {
        borderColor: 'transparent',
        color: 'transparent'
      },
      emphasis: {
        itemStyle: {
          borderColor: 'transparent',
          color: 'transparent'
        }
      },
      data: [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292]
    },
    {
      name: '收入',
      type: 'bar',
      stack: 'Total',
      label: {
        show: true,
        position: 'top'
      },
      data: [900, 345, 393, '-', '-', 135, 178, 286, '-', '-', '-']
    },
    {
      name: '支出',
      type: 'bar',
      stack: 'Total',
      label: {
        show: true,
        position: 'bottom'
      },
      data: ['-', '-', '-', 108, 154, '-', '-', '-', 119, 361, 203]
    }
  ]
};

export {};
