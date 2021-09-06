/*
title: Custom Cartesian Polygon
titleCN: 自定义多边形图
category: custom
difficulty: 3
*/


var data = [];
var dataCount = 7;
for (var i = 0; i < dataCount; i++) {
    var val = Math.random() * 1000;
    data.push([
        echarts.number.round(Math.random() * 100),
        echarts.number.round(Math.random() * 400)
    ]);
}

function renderItem(params, api) {
    if (params.context.rendered) {
        return;
    }
    params.context.rendered = true;

    var points = [];
    for (var i = 0; i < data.length; i++) {
        points.push(api.coord(data[i]));
    }
    var color = api.visual('color');

    return {
        type: 'polygon',
        transition: ['shape'],
        shape: {
            points: points
        },
        style: api.style({
            fill: color,
            stroke: echarts.color.lift(color)
        })
    };
}

option = {
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['bar', 'error']
    },
    dataZoom: [{
        type: 'slider',
        filterMode: 'none'
    }, {
        type: 'inside',
        filterMode: 'none'
    }],
    xAxis: {},
    yAxis: {},
    series: [{
        type: 'custom',
        renderItem: renderItem,
        clip: true,
        data: data
    }]
};
