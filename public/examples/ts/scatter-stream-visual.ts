/*
title: Visual interaction with stream
category: scatter
titleCN: 流式渲染和视觉映射操作
difficulty: 5
*/

// Thanks to: 若怀冰
// http://gallery.echartsjs.com/explore.html?u=bd-16906679
// http://gallery.echartsjs.com/editor.html?c=xHJw-hVqjW

$.getJSON(
  ROOT_PATH + '/data/asset/data/house-price-area2.json',
  function (data) {
    var option = {
      title: {
        text: 'Dispersion of house price based on the area',
        left: 'center',
        top: 0
      },
      visualMap: {
        min: 15202,
        max: 159980,
        dimension: 1,
        orient: 'vertical',
        right: 10,
        top: 'center',
        text: ['HIGH', 'LOW'],
        calculable: true,
        inRange: {
          color: ['#f2c31a', '#24b7f2']
        }
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'cross'
        }
      },
      xAxis: [
        {
          type: 'value'
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'price-area',
          type: 'scatter',
          symbolSize: 5,
          data: data
        }
      ]
    };

    myChart.setOption(option);
  }
);

export {};
