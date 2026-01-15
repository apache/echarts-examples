/*
title: Smoothed Line Chart
category: line
titleCN: 基础平滑折线图
difficulty: 0
*/

option = {
  tooltip:{
     trigger: 'item',
     formatter: function(params: any){
      return(
         '<b>Category:</b>' + params.name + '<br/>' +
         '<b>Value:</b>' + params.value
      );
     }
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: 'line',
      smooth: true,
      symbolSize: 8,
      emphasis:{
        focus: 'series'
      }
    }
  ]
};
export {};
