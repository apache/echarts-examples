/*
title: Area Chart with Time Axis
titleCN: 时间轴折线图
category: line
difficulty: 5
*/

var base = +new Date(1988, 9, 3);
var oneDay = 24 * 3600 * 1000;

var data = [[base, Math.random() * 300]];

for (var i = 1; i < 20000; i++) {
    var now = new Date(base += oneDay);
    data.push([
        [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
        Math.round((Math.random() - 0.5) * 20 + data[i - 1][1])
    ]);
}

option = {
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    title: {
        left: 'center',
        text: '大数据量面积图',
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'time',
        boundaryGap: false
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%']
    },
    dataZoom: [{
        type: 'inside',
        start: 0,
        end: 20
    }, {
        start: 0,
        end: 20
    }],
    series: [
        {
            name: '模拟数据',
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {},
            data: data
        }
    ]
};