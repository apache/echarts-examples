/*
title: Gauge Basic progress chart
titleCN: 基础仪表盘
category: gauge
difficulty: 2
*/

option = {
    series: [{
        type: 'gauge',
        pointer: {
            show: false,
        },
        progress: {
            show: true,
        },
        data: [{
            value: 20,
            name: '完成率'
        }],
        detail: {
            formatter: '{value}%'
        },
    }]
};

setInterval(function() {
    option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
    myChart.setOption(option, true);
}, 2000);
