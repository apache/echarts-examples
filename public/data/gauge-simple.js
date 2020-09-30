/*
title: Simple Gauge 
category: gauge
titleCN: 仪表盘简单示例
*/

var value = 70;
option = {
    series: [{
            type: 'gauge',
            startAngle: 225,
            endAngle: -45,
            min: 0,
            max: 100,
            radius: '67%',
            detail: {
                offsetCenter: [0, '80%'],
                formatter: function(value) {
                    return value
                },
                fontSize: 100,
                fontWeight: 800,
            },
            axisLine: {
                lineStyle: {
                    color: '#999',
                }
            },
            axisLabel: {
                color: '#999',
                fontSize: 20,
            },
            axisTick: {
                show: false
            },
            splitLine: {
                length: 20,
                lineStyle: {
                    color: '#999'
                }
            },
            itemStyle: {
                color: '#5470C6',
            },
             pointer: {
                width: 8,
                length: '70%'
            },
            markPoint: {
                animation: false,
                data: [{
                    x: '50%',
                    y: '50%',
                    symbol: 'circle',
                    symbolSize: 40,
                    itemStyle: {
                        color: '#5470C6',
                    },
                }, {
                    x: '50%',
                    y: '50%',
                    symbol: 'circle',
                    symbolSize: 15,
                    itemStyle: {
                        color: '#fff'
                    },
                }]
            },
            data: [{
                value: value,
            }]
        },
        {
            type: 'gauge',
            radius: '75%',
            startAngle: 225,
            endAngle: -45,
            min: 0,
            max: 100,
            title: {
                show: false
            },
            detail: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    width: 18,
                    color: [
                        [value / 100, '#5470C6'],
                        [1, 'rgba(210,219,238,0.3)']
                    ],
                }
            },
            axisLabel: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            },
            pointer: {
                show: false,
            },
        }
    ]
}