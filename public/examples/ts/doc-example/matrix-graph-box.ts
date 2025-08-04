/*
ignore: true
since: 6.0.0
*/

option = {
  matrix: {
    x: {
      levelSize: 50,
      data: ['a', 'b', 'c', 'd'],
    },
    y: {
      levelSize: 50,
      data: ['x', 'y', 'z'],
    },
  },
  series: [
    {
      type: 'graph',
      coordinateSystem: 'matrix',
      coordinateSystemUsage: 'box',
      coord: [2, 1],
      edgeSymbol: ['none', 'arrow'],
      symbolSize: 15,
      links: [
        {source: 1, target: 0},
        {source: 2, target: 0},
        {source: 3, target: 0},
        {source: 4, target: 3},
        {source: 4, target: 2},
        {source: 5, target: 1},
        {source: 6, target: 3}
      ],
      data: [
        { name: 'a', x: 110, y: 100, value: [134] },
        { name: 'b', x: 270, y: 10, value: [421] },
        { name: 'c', x: 330, y: 100, value: [152] },
        { name: 'd', x: 401, y: 500, value: [216] },
        { name: 'e', x: 530, y: 200, value: [155] },
        { name: 'f', x: 610, y: 140, value: [212] },
        { name: 'g', x: 780, y: 70, value: [161] }
      ],
      lineStyle: {
        color: '#9af',
        width: 2,
        opacity: 1
      }
    }
  ],
};
