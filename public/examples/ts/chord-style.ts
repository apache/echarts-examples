/*
title: Chord Style
category: chord
titleCN: 和弦图样式
difficulty: 10
since: 6.0.0
*/

option = {
  tooltip: {},
  legend: {},
  series: [
    {
      type: 'chord',
      padAngle: 1,
      center: ['50%', '48%'],
      radius: ['70%', '80%'],
      data: [
        { name: 'A' },
        { name: 'B' },
        { name: 'C' },
        { name: 'D' },
        { name: 'E' },
        { name: 'F' },
        { name: 'G' }
      ],
      itemStyle: {
        borderRadius: [0, 15],
        borderWidth: 2,
        borderColor: '#fff'
      },
      lineStyle: {
        opacity: 0.3,
        color: 'gradient' // or 'source' (default), 'target'
      },
      emphasis: {
        focus: 'self' // or 'none', 'adjacency' (default)
      },
      label: {
        show: true,
        position: 'inside',
        color: '#fff',
        fontWeight: 'bold'
      },
      links: [
        { source: 'A', target: 'B', value: 14 },
        { source: 'A', target: 'C', value: 8 },
        { source: 'B', target: 'C', value: 20 },
        { source: 'B', target: 'E', value: 15 },
        { source: 'C', target: 'B', value: 8 },
        { source: 'C', target: 'E', value: 3 },
        { source: 'D', target: 'A', value: 12 },
        { source: 'D', target: 'B', value: 3 },
        { source: 'E', target: 'A', value: 15 },
        { source: 'E', target: 'C', value: 5 },
        { source: 'F', target: 'C', value: 5 },
        { source: 'G', target: 'A', value: 6 },
        { source: 'G', target: 'B', value: 8 },
        { source: 'G', target: 'D', value: 4 }
      ]
    }
  ]
};

export {};
