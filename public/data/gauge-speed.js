/*
title: Gauge Speed
category: gauge
titleCN: 速度仪表盘
*/

var value = 70;
var color = new echarts.graphic.LinearGradient(
    0, 0, 1, 0,
    [{
            offset: 0,
            color: "#58D9F9",
        },
        {
            offset: 1,
            color: "#4992FF",
        }
    ]
);
option = {
    backgroundColor: '#fff',
    series: [{
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            radius: '60%',
            axisLine: {
                show: true,
                lineStyle: {
                    color: [
                        [1, '#999']
                    ],
                    width: 1,
                    opacity: 1
                }
            },
            title: {
                show: false
            },
            detail: {
                backgroundColor: '#fff',
                borderColor: '#999',
                borderWidth: 2,
                width: '80%',
                borderRadius: 4,
                offsetCenter: [0, '50%'],
                formatter: function(value) {
                    return '{value|' + value.toFixed(0) + '}{unit|km/h}';
                },
                rich: {
                    value: {
                        fontSize: 60,
                        fontWeight: 'bolder',
                        color: '#777'
                    },
                    unit: {
                        fontSize: 20,
                        color: '#999',
                        padding: [0, 0, 15, 6]
                    },
                }
            },
            axisLine: {
                show: false
            },
            axisTick: {
                length: 10,
                lineStyle: {
                    color: '#999'
                }
            },
            splitLine: {
                length: 15,
                lineStyle: {
                    color: '#999',
                    width: 3
                }
            },
            axisLabel: {
                color: '#999'
            },
            pointer: {
                width: 10,
                length: '70%'
            },
            itemStyle: {
                color: color,
                shadowColor: 'rgba(0,138,255,0.45)',
                shadowBlur: 10,
                shadowOffsetX: 2,
                shadowOffsetY: 2
            },
            markPoint: {

                data: [{
                    x: "50%",
                    y: "50%",
                    symbol: 'circle',
                    symbolSize: 8,
                    itemStyle: {
                        color: "#fff"
                    },
                }]
            },
            data: [{
                value: value,
            }, ]
        },
        {
            type: 'gauge',
            radius: '70%',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            title: {
                show: false
            },
            detail: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    width: 16,
                    color: [
                        [
                            value / 100, color
                        ],
                        [
                            1, 'rgba(225,225,225,0.4)'
                        ]
                    ],
                }
            },
            axisTick: {
                show: false,
            },
            splitLine: {
                show: false,
            },
            axisLabel: {
                show: false
            },
            pointer: {
                show: false,
            },
            itemStyle: {
                normal: {
                    color: '#54F200',
                }
            },
        }
    ]

}