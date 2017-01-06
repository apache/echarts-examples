
var paper = 'image://data:image/png;base64,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';
var startData = 13000;
var maxData = 18000;
var minData = 5000;

option = {
    backgroundColor: '#0f375f',
    tooltip: {},
    legend: {
        data: ['all'],
        textStyle: {color: '#ddd'}
    },
    grid: {
        right: 20,
        left: 140,
        bottom: 160
    },
    xAxis: {
        data: ['a', 'b', 'c', 'd'],
        axisTick: {show: false},
        axisLine: {
            lineStyle: {
                color: '#ddd'
            }
        },
        axisLabel: {show: false}
    },
    yAxis: {
        splitLine: {show: false},
        axisTick: {
            lineStyle: {
                color: '#ddd'
            }
        },
        axisLine: {
            lineStyle: {
                color: '#ddd'
            }
        },
        axisLabel: {
            textStyle: {
                color: '#ddd'
            }
        }
    },
    animationEasing: 'cubicOut',
    animationDuration: 100,
    animationDurationUpdate: 2000,
    series: [{
        type: 'pictorialBar',
        name: 'all',
        id: 'paper',
        hoverAnimation: true,
        label: {
            normal: {
                show: true,
                position: 'top',
                formatter: '{c} km',
                textStyle: {
                    fontSize: 16,
                    color: '#e54035'
                }
            }
        },
        symbol: paper,
        symbolSize: ['70%', 50],
        symbolMargin: '-25%',
        data: [{
            value: maxData,
            symbolRepeat: true
        }, {
            value: startData,
            symbolRepeat: true
        }, {
            value: startData,
            symbolBoundingData: startData,
            symbolRepeat: true
        }, {
            value: startData,
            symbolBoundingData: startData,
            symbolRepeat: 20
        }],
        markLine: {
            symbol: ['none', 'none'],
            label: {
                normal: {show: false}
            },
            lineStyle: {
                normal: {
                    color: '#e54035'
                }
            },
            data: [{
                yAxis: startData
            }]
        }
    }, {
        name: 'all',
        type: 'pictorialBar',
        symbol: 'circle',
        itemStyle: {
            normal: {
                color: '#185491'
            }
        },
        silent: true,
        symbolSize: ['150%', 50],
        symbolOffset: [0, 20],
        z: -10,
        data: [1, 1, 1, 1]
    }]
};



setInterval(function () {
    var dynamicData = Math.round(Math.random() * (maxData - minData) + minData);

    myChart.setOption({
        series: [{
            id: 'paper',
            data: [{
                value: maxData,
                symbolRepeat: true
            }, {
                value: dynamicData,
                symbolRepeat: true
            }, {
                value: dynamicData,
                symbolBoundingData: dynamicData,
                symbolRepeat: true
            }, {
                value: dynamicData,
                symbolBoundingData: dynamicData,
                symbolRepeat: 20
            }],
            markLine: {
                data: [{
                    yAxis: dynamicData
                }]
            }
        }]
    });
}, 3000);




// Add descriptions.
function addDescriptions() {
    var descriptions = [
        [
            'symbolBoundingData:',
            'value:',
            'symbolRepeat:',
            'characteristic:',
        ],
        [
            'default',
            'max value',
            'true (auto)',
            'This is a standard'
        ],
        [
            'default',
            'current value',
            'true (auto)',
            'Not accurate\nSymbol gap stable\nAppropriate to compare\nwith other bar'
        ],
        [
            'current value',
            'current value',
            'true (auto)',
            'Accurate\nSymbol gap unstable\nInappropriate to compare\nwith other bar'
        ],
        [
            'current value',
            'current value',
            '20 (a fixed number)',
            'Accurate\nSymbol gap unstable\nNot responsive'
        ]
    ];

    myChart.setOption({
        graphic: echarts.util.map(descriptions, function (item, index) {
            var pos = myChart.convertToPixel('grid', [Math.max(index - 1, 0), -1000]);

            return {
                type: 'group',
                position: pos,
                left: index ? null : 10,
                children: [{
                    type: 'text',
                    left: 'center',
                    top: 0,
                    style: {
                        text: descriptions[index].join('\n\n'),
                        fill: index ? '#fff' : 'yellow',
                        textAlign: index ? 'left' : 'right'
                    },
                    z: 101
                }]
            };
        })
    }, {silent: true});
}

setTimeout(function () {
    addDescriptions();
    myChart.on('updated', addDescriptions);
}, 100);