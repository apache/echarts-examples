/*
title: Node Align Left in Sankey
category: sankey
titleCN: 桑基图左对齐布局
difficulty: 3
*/

myChart.showLoading();
$.get(ROOT_PATH + '/data/asset/data/energy.json', function (data) {
  myChart.hideLoading();

  myChart.setOption(
    (option = {
      title: {
        text: 'Node Align Right'
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'sankey',
          emphasis: {
            focus: 'adjacency'
          },
          nodeAlign: 'left',
          data: data.nodes,
          links: data.links,
          lineStyle: {
            color: 'source',
            curveness: 0.5
          }
        }
      ]
    })
  );
});

export {};
