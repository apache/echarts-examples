/*
title: Chord minAngle
category: chord
titleCN: 和弦图 minAngle
difficulty: 1
since: 6.0.0
*/

option = {
  tooltip: {},
  legend: {},
  series: [
    {
      type: 'chord',
      label: { show: true },
      minAngle: 30,
      data: [
        { name: 'A' },
        { name: 'B' },
        { name: 'C' },
        { name: 'D' },
        { name: 'E' },
        { name: 'F' }
      ],
      links: [
        { source: 'A', target: 'B', value: 40 },
        { source: 'B', target: 'C', value: 20 },
        { source: 'E', target: 'A', value: 5 }
      ]
    }
  ]
};

export {};
