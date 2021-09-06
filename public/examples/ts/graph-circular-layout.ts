/*
title: Les Miserables
category: graph
titleCN: 悲惨世界人物关系图(环形布局)
shotWidth: 900
difficulty: 5
*/

interface GraphNode {
  symbolSize: number;
  label?: {
    show?: boolean;
  };
}

myChart.showLoading();
$.getJSON(ROOT_PATH + '/data/asset/data/les-miserables.json', function (graph) {
  myChart.hideLoading();

  graph.nodes.forEach(function (node: GraphNode) {
    node.label = {
      show: node.symbolSize > 30
    };
  });

  option = {
    title: {
      text: 'Les Miserables',
      subtext: 'Circular layout',
      top: 'bottom',
      left: 'right'
    },
    tooltip: {},
    legend: [
      {
        data: graph.categories.map(function (a: { name: string }) {
          return a.name;
        })
      }
    ],
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        name: 'Les Miserables',
        type: 'graph',
        layout: 'circular',
        circular: {
          rotateLabel: true
        },
        data: graph.nodes,
        links: graph.links,
        categories: graph.categories,
        roam: true,
        label: {
          position: 'right',
          formatter: '{b}'
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3
        }
      }
    ]
  };

  myChart.setOption(option);
});

export {};
