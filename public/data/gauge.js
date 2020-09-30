/*
title: Gauge
category: gauge
titleCN: Gauge
*/

option = {
    tooltip: {
        formatter: '{a} <br/>{b} : {c}%'
    },
    toolbox: {
        feature: {
            restore: {},
            saveAsImage: {}
        }
    },
    series: [{
        type: 'gauge',
        detail: {
            formatter: '{value}%',
            fontSize: 50,
        },
        axisLine: {
            show: true,
            lineStyle: {
                width: 30,
                shadowBlur: 0,
                color: [
                    [0.3, '#91CC75'],
                    [0.7, '#5470C6'],
                    [1, '#EE6666']
                ]
            }
        },
        axisLabel: {
            show: true,
            fontSize: 18,
            distance: 10,
        },
        data: [{
            value: 50,
        }],
        pointer: {
            show: true,
            length: '75%',
            width: 15,
        },
    }]
};

setInterval(function () {
    option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
    myChart.setOption(option, true);
},2000);