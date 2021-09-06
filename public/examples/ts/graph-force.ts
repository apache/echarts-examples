/*
title: Force Layout
category: graph
titleCN: 力引导布局
difficulty: 3
*/

interface GraphNode {
  symbolSize: number;
  label?: {
    show?: boolean;
  };
}
myChart.showLoading();
$.get(ROOT_PATH + '/data/asset/data/les-miserables.json', function (graph) {
  myChart.hideLoading();
  graph.nodes.forEach(function (node: GraphNode) {
    node.symbolSize = 5;
  });
  option = {
    title: {
      text: 'Les Miserables',
      subtext: 'Default layout',
      top: 'bottom',
      left: 'right'
    },
    tooltip: {},
    legend: [
      {
        // selectedMode: 'single',
        data: graph.categories.map(function (a: { name: string }) {
          return a.name;
        })
      }
    ],
    series: [
      {
        name: 'Les Miserables',
        type: 'graph',
        layout: 'force',
        data: graph.nodes,
        links: graph.links,
        categories: graph.categories,
        roam: true,
        label: {
          position: 'right'
        },
        force: {
          repulsion: 100
        }
      }
    ]
  };

  myChart.setOption(option);
});

export {};
