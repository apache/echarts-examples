/*
title: Radial Tree
category: tree
titleCN: 径向树状图
*/

myChart.showLoading();
$.get(ROOT_PATH + '/data/asset/data/flare.json', function (data) {
  myChart.hideLoading();

  myChart.setOption(
    (option = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'tree',

          data: [data],

          top: '18%',
          bottom: '14%',

          layout: 'radial',

          symbol: 'emptyCircle',

          symbolSize: 7,

          initialTreeDepth: 3,

          animationDurationUpdate: 750,

          emphasis: {
            focus: 'descendant'
          }
        }
      ]
    })
  );
});

export {};
