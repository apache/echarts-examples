/*
title: Chord lineStyle.color
category: chord
titleCN: 和弦图边的颜色
difficulty: 3
since: 6.0.0
*/

function generateSeries(id: number, lineColor: 'source' | 'target' | 'gradient') {
  return {
    type: 'chord' as const,
    label: { show: true },
    center: [((id * 2 + 1) / 6) * 100 + '%', '50%'],
    radius: ['28%', '32%'],
    lineStyle: {
      color: lineColor
    },
    data: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }],
    links: [
      { source: 'A', target: 'B', value: 30 },
      { source: 'A', target: 'C', value: 20 },
      { source: 'B', target: 'D', value: 10 },
      { source: 'C', target: 'A', value: 15 },
      { source: 'D', target: 'A', value: 25 }
    ]
  };
}

function generateTitle(id: number, text: string) {
  return {
    text,
    left: ((id * 2 + 1) / 6) * 100 + '%',
    top: '25%',
    textAlign: 'center' as const,
    padding: 0
  };
}

option = {
  tooltip: {},
  legend: {},
  series: [
    generateSeries(0, 'source'),
    generateSeries(1, 'target'),
    generateSeries(2, 'gradient')
  ],
  title: [
    {
      text: 'lineStyle.color',
      textStyle: {
        fontSize: 24
      }
    },
    generateTitle(0, 'source'),
    generateTitle(1, 'target'),
    generateTitle(2, 'gradient')
  ]
};
