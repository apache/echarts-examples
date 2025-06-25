/*
title: NPM Dependencies with graphGL
category: graphGL
theme: dark
titleCN: 1w 节点 2w7 边的 NPM 依赖图
shotDelay: 5000
shotWidth: 1920
*/

$.getJSON(ROOT_PATH + '/data-gl/asset/data/npmdep.json', function (data) {
  var nodes = data.nodes.map(function (nodeName, idx) {
    return {
      name: nodeName,
      value: data.dependentsCount[idx]
    };
  });
  var edges = [];
  for (var i = 0; i < data.edges.length; ) {
    var s = data.edges[i++];
    var t = data.edges[i++];
    edges.push({
      source: s,
      target: t
    });
  }

  nodes.forEach(function (node) {
    // if (node.value > 100) {
    node.emphasis = {
      label: {
        show: true
      }
    };
    // }
    if (node.value > 5000) {
      node.label = {
        show: true
      };
    }
  });

  myChart.setOption({
    backgroundColor: '#000',
    series: [
      {
        color: [
          'rgb(203,239,15)',
          'rgb(73,15,239)',
          'rgb(15,217,239)',
          'rgb(30,15,239)',
          'rgb(15,174,239)',
          'rgb(116,239,15)',
          'rgb(239,15,58)',
          'rgb(15,239,174)',
          'rgb(239,102,15)',
          'rgb(239,15,15)',
          'rgb(15,44,239)',
          'rgb(239,145,15)',
          'rgb(30,239,15)',
          'rgb(239,188,15)',
          'rgb(159,239,15)',
          'rgb(159,15,239)',
          'rgb(15,239,44)',
          'rgb(15,239,87)',
          'rgb(15,239,217)',
          'rgb(203,15,239)',
          'rgb(239,15,188)',
          'rgb(239,15,102)',
          'rgb(239,58,15)',
          'rgb(239,15,145)',
          'rgb(116,15,239)',
          'rgb(15,131,239)',
          'rgb(73,239,15)',
          'rgb(15,239,131)',
          'rgb(15,87,239)',
          'rgb(239,15,231)'
        ],
        type: 'graphGL',
        nodes: nodes,
        edges: edges,
        modularity: {
          resolution: 2,
          sort: true
        },
        lineStyle: {
          color: 'rgba(255,255,255,1)',
          opacity: 0.05
        },
        itemStyle: {
          opacity: 1
          // borderColor: '#fff',
          // borderWidth: 1
        },
        focusNodeAdjacency: false,
        focusNodeAdjacencyOn: 'click',
        symbolSize: function (value) {
          return Math.sqrt(value / 10);
        },
        label: {
          color: '#fff'
        },
        emphasis: {
          label: {
            show: false
          },
          lineStyle: {
            opacity: 0.5,
            width: 4
          }
        },
        forceAtlas2: {
          steps: 5,
          stopThreshold: 20,
          jitterTolerence: 10,
          edgeWeight: [0.2, 1],
          gravity: 5,
          edgeWeightInfluence: 0
          // preventOverlap: true
        }
      }
    ]
  });
});
