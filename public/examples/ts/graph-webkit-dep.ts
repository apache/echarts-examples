/*
title: Graph Webkit Dep
category: graph
titleCN: WebKit 模块关系依赖图
shotWidth: 900
difficulty: 8
*/

myChart.showLoading();

myChart.showLoading();
$.get(ROOT_PATH + '/data/asset/data/webkit-dep.json', function (webkitDep) {
  myChart.hideLoading();

  option = {
    legend: {
      data: ['HTMLElement', 'WebGL', 'SVG', 'CSS', 'Other']
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        animation: false,
        label: {
          position: 'right',
          formatter: '{b}'
        },
        draggable: true,
        data: webkitDep.nodes.map(function (node: any, idx: number) {
          node.id = idx;
          return node;
        }),
        categories: webkitDep.categories,
        force: {
          edgeLength: 5,
          repulsion: 20,
          gravity: 0.2
        },
        edges: webkitDep.links
      }
    ]
  };

  myChart.setOption(option);
});

export {};
