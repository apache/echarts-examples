option = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
    }, {
        data: [20, 40, 90, 40, 30, 70, 120],
        type: 'bar'
    }, {
        data: [140, 230, 120, 50, 30, 150, 120],
        type: 'bar'
    }],
    aria: {
        enabled: true,
        decal: {
            show: true
        }
    }
};
