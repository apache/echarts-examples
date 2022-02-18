option = {
    legend: {
        data: ['pictorialBar', 'bar']
    },
    xAxis: {
        data: ['symbolRepeat: true', 'symbolRepeat: false']
    },
    yAxis: {
        splitLine: {show: false}
    },
    animationEasing: 'elasticOut',
    series: [{
        type: 'pictorialBar',
        symbol: 'circle',
        data: [{
            value: 29000,
            symbolRepeat: true,
            symbolSize: [50, 50]
        }, {
            value: 29000,
            symbolSize: [50, '100%']
        }]
    }]
};