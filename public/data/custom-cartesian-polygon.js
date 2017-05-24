
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
        shape: {
            points: echarts.graphic.clipPointsByRect(points, {
                x: params.coordSys.x,
                y: params.coordSys.y,
                width: params.coordSys.width,
                height: params.coordSys.height
            })
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
        filterMode: 'none',
        height: 8,
        bottom: 20,
        borderColor: 'transparent',
        backgroundColor: '#e2e2e2',
        handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
        handleSize: 20,
        handleStyle: {
            shadowBlur: 6,
            shadowOffsetX: 1,
            shadowOffsetY: 2,
            shadowColor: '#aaa'
        }
    }, {
        type: 'inside',
        filterMode: 'none'
    }],
    xAxis: {},
    yAxis: {},
    series: [{
        type: 'custom',
        renderItem: renderItem,
        data: data
    }]
};
