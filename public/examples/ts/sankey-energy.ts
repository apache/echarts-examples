/*
title: Gradient Edge
category: sankey
titleCN: 桑基图渐变色边
difficulty: 3
*/

myChart.showLoading();
$.get(ROOT_PATH + '/data/asset/data/energy.json', function (data) {
  myChart.hideLoading();

  myChart.setOption(
    (option = {
      title: {
        text: 'Sankey Diagram'
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'sankey',
          data: data.nodes,
          links: data.links,
          emphasis: {
            focus: 'adjacency'
          },
          lineStyle: {
            color: 'gradient',
            curveness: 0.5
          }
        }
      ]
    })
  );
});

export {};
