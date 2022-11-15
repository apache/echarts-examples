/*
title: Calendar Graph
category: 'calendar, graph'
titleCN: 日历关系图
difficulty: 4
*/

const graphData: [string, number][] = [
  ['2017-02-01', 260],
  ['2017-02-04', 200],
  ['2017-02-09', 279],
  ['2017-02-13', 847],
  ['2017-02-18', 241],
  ['2017-02-23', 411],
  ['2017-03-14', 985]
];

const links = graphData.map(function (item, idx) {
  return {
    source: idx,
    target: idx + 1
  };
});
links.pop();

function getVirtualData(year: string) {
  const date = +echarts.time.parse(year + '-01-01');
  const end = +echarts.time.parse(+year + 1 + '-01-01');
  const dayTime = 3600 * 24 * 1000;
  const data: [string, number][] = [];
  for (let time = date; time < end; time += dayTime) {
    data.push([
      echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
      Math.floor(Math.random() * 1000)
    ]);
  }
  return data;
}

option = {
  tooltip: {},
  calendar: {
    top: 'middle',
    left: 'center',
    orient: 'vertical',
    cellSize: 40,
    yearLabel: {
      margin: 50,
      fontSize: 30
    },
    dayLabel: {
      firstDay: 1,
      nameMap: 'cn'
    },
    monthLabel: {
      nameMap: 'cn',
      margin: 15,
      fontSize: 20,
      color: '#999'
    },
    range: ['2017-02', '2017-03-31']
  },
  visualMap: {
    min: 0,
    max: 1000,
    type: 'piecewise',
    left: 'center',
    bottom: 20,
    inRange: {
      color: ['#5291FF', '#C7DBFF']
    },
    seriesIndex: [1],
    orient: 'horizontal'
  },
  series: [
    {
      type: 'graph',
      edgeSymbol: ['none', 'arrow'],
      coordinateSystem: 'calendar',
      links: links,
      symbolSize: 15,
      calendarIndex: 0,
      itemStyle: {
        color: 'yellow',
        shadowBlur: 9,
        shadowOffsetX: 1.5,
        shadowOffsetY: 3,
        shadowColor: '#555'
      },
      lineStyle: {
        color: '#D10E00',
        width: 1,
        opacity: 1
      },
      data: graphData,
      z: 20
    },
    {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: getVirtualData('2017')
    }
  ]
};

export {};
