option = {
    title: [{
        text: 'Radial Polar Bar Label Position (middle)'
    }],
    polar: {
        radius: [30, '80%']
    },
    radiusAxis: {
        max: 4,
        startAngle: 75
    },
    angleAxis: {
        type: 'category',
        data: ['a', 'b', 'c', 'd'],
        startAngle: 75
    },
    tooltip: {},
    series: {
        type: 'bar',
        data: [2, 1.2, 2.4, 3.6],
        coordinateSystem: 'polar',
        label: {
            show: true,
            position: 'middle', // or 'start', 'insideStart', 'end', 'insideEnd'
            formatter: '{b}: {c}',
        }
    },
    backgroundColor: '#fff',
    animation: 0
};
