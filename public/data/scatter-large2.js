function genData(len, offset) {
    // console.profile('gen');
    var lngRange = [-10.781327, 131.48];
    var latRange = [18.252847, 52.33];

    var arr = new Float32Array(len * 2);
    var off = 0;

    for (var i = 0; i < len; i++) {
        var x = +Math.random() * 10;
        var y = +Math.sin(x) - x * (len % 2 ? 0.1 : -0.1) * Math.random() + (offset || 0) / 10;
        arr[off++] = x;
        arr[off++] = y;
    }
    return arr;
}

option = {
    tooltip: {},
    toolbox: {
        left: 'center',
        feature: {
            dataZoom: {}
        }
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['pm2.5' /* ,'pm10' */]
    },
    xAxis: [{
    }],
    yAxis: [{
    }],
    dataZoom: [{
        type: 'inside'
    }, {
        type: 'slider'
    }],
    animation: false,
    series : [{
        name: 'pm2.5',
        type: 'scatter',
        data: genData(5e5),
        dimensions: ['x', 'y'],
        symbolSize: 3,
        itemStyle: {
            color: '#128de3',
            opacity: 0.4
        },
        large: true
    }]
};
