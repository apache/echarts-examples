option = {
    tooltip: {},
    angleAxis: {
        type: 'category',
        endAngle: -180,
        data: ['S1', 'S2', 'S3']
    },
    radiusAxis: {},
    polar: {},
    series: [{
        type: 'bar',
        polarIndex: 0,
        data: [1, 2, 3],
        coordinateSystem: 'polar'
    }]
};
