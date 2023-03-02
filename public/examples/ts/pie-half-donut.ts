/*
title: Half Doughnut Chart
category: pie
titleCN: 半环形图
difficulty: 1
*/

option = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center',
    selectedMode: false, // doesn't work with our tricks, disable it
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['70%', '100%'],
      center: ['50%', '100%'], // move down the chart to hide the bottom half
      startAngle: 180, // adjust the start angle
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' },
        {
          value: 1048 + 735 + 580 + 484 + 300, // make an record to fill the bottom 50%
          name: '', // hide the legend
          itemStyle: {
            color: '#ffffff', // make the piece invisible
          },
        },
      ]
    }
  ]
};
export {};
