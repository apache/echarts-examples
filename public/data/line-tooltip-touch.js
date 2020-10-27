/*
title: Tooltip and DataZoom on Mobile
category: 'line, dataZoom'
titleCN: 移动端上的 dataZoom 和 tooltip
difficulty: 10
*/

var base = +new Date(2016, 9, 3);
var oneDay = 24 * 3600 * 1000;
var valueBase = Math.random() * 300;
var valueBase2 = Math.random() * 50;
var data = [];
var data2 = [];

for (var i = 1; i < 10; i++) {
    var now = new Date(base += oneDay);
    var dayStr = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('-');

    valueBase = Math.round((Math.random() - 0.5) * 20 + valueBase);
    valueBase <= 0 && (valueBase = Math.random() * 300);
    data.push([dayStr, valueBase]);

    valueBase2 = Math.round((Math.random() - 0.5) * 20 + valueBase2);
    valueBase2 <= 0 && (valueBase2 = Math.random() * 50);
    data2.push([dayStr, valueBase2]);
}

option = {
    title: {
        left: 'center',
        text: '触屏 tooltip 和 dataZoom 示例',
        subtext: '"tootip" and "dataZoom" on mobile device',
    },
    legend: {
        top: 'bottom',
        data: ['意向']
    },
    tooltip: {
        triggerOn: 'none',
        position: function (pt) {
            return [pt[0], 130];
        }
    },
    toolbox: {
        left: 'center',
        itemSize: 25,
        top: 55,
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {}
        }
    },
    xAxis: {
        type: 'time',
        // boundaryGap: [0, 0],
        axisPointer: {
            value: '2016-10-7',
            snap: true,
            lineStyle: {
                color: '#7581BD',
                width: 2
            },
            label: {
                show: true,
                formatter: function (params) {
                    return echarts.format.formatTime('yyyy-MM-dd', params.value);
                },
                backgroundColor: '#7581BD'
            },
            handle: {
                show: true,
                color: '#7581BD'
            }
        },
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'value',
        axisTick: {
            inside: true
        },
        splitLine: {
            show: false
        },
        axisLabel: {
            inside: true,
            formatter: '{value}\n'
        },
        z: 10
    },
    grid: {
        top: 110,
        left: 15,
        right: 15,
        height: 160
    },
    dataZoom: [{
        type: 'inside',
        throttle: 50
    }],
    series: [
        {
            name: '模拟数据',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            sampling: 'average',
            itemStyle: {
                color: '#0770FF'
            },
            stack: 'a',
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(58,77,233,0.8)'
                }, {
                    offset: 1,
                    color: 'rgba(58,77,233,0.3)'
                }])
            },
            data: data
        },
        {
            name: '模拟数据',
            type: 'line',
            smooth: true,
            stack: 'a',
            symbol: 'circle',
            symbolSize: 5,
            sampling: 'average',
            itemStyle: {
                color: '#F2597F'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(213,72,120,0.8)'
                }, {
                    offset: 1,
                    color: 'rgba(213,72,120,0.3)'
                }])
            },
            data: data2
        }
    ]
};