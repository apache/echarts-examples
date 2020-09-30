/*
title: Gauge level
category: gauge
titleCN: 分级仪表盘
*/

option = {
    tooltip: {
        formatter: '{b}{c}'
    },
    series: [{
        type: 'gauge',
        radius: '83%',
        center: ['50%', '60%'],
        startAngle: 180,
        endAngle: 0,
        tooltip: {
            show: false
        },
        detail: {
            show: false
        },
        axisLine: {
            lineStyle: {
                width: 5,
                color: [
                    [0.2, '#FF6E76'],
                    [0.5, '#FDDD60'],
                    [0.8, '#58D9F9'],
                    [1, '#7CFFB2'],
                ]
            }
        }, 
        axisLabel: {
            show: false
        }, 
        axisTick: {
            show: false,
        }, 
        splitLine: {
            show: false,
        }, 
    }, {
        type: 'gauge',
        radius: '80%',
        min: 0,
        max: 100,
        center: ['50%', '60%'],
        splitNumber: 10,
        startAngle: 180,
        endAngle: 0,
        data: [{
            value: 75,
            name: '完成率',
        }],
        title: {
            offsetCenter: ['0', '-60%'],
            fontSize: 40,
            fontWeight: 'bolder',
        },
        detail: {
            formatter: function(value) {
                return value + '%'
            },
            fontSize: 50,
            fontWeight: 'bolder',
            offsetCenter: ['0%', '-40%']
        },
        axisLine: {
            lineStyle: {
                width: 0,
                color: [
                    [0.2, '#FF6E76'],
                    [0.5, '#FDDD60'],
                    [0.8, '#58D9F9'],
                    [1, '#7CFFB2'],
                ]
            }
        },
        axisLabel: {
            color: '#464646',
            fontSize: 20,
            distance: -70,
            formatter: function(value) {
                if (value >= 80) {
                    return '优'
                } 
                else if (value >= 50) {
                    return '中'
                } 
                else if (value >= 20) {
                    return '良'
                } 
                else if (value >= 0) {
                    return '差'
                }
            }
        },
        axisTick: {
            splitNumber: 10,
            show: true,
            lineStyle: {
                color: 'auto',
                width: 2
            },
            length: 15,
        },
        splitLine: {
            show: true,
            length: 20,
            lineStyle: {
                color: 'auto',
                width: 5
            }
        },
        itemStyle: {
            normal: {
                color: 'auto'
            }
        },
        pointer: {
            width: 10,
            length: '80%'
        }
    }]
};