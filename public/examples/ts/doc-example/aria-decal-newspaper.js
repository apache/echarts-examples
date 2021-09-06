option = {
    series: [{
        type: 'bar',
        name: 'Apples',
        data: [108, 26, 39, 24],
        itemStyle: {
            borderColor: 'black',
            borderWidth: 2
        }
    }, {
        type: 'bar',
        name: 'Oranges',
        data: [23, 40, 60, 70],
        itemStyle: {
            borderColor: 'black',
            borderWidth: 2
        }
    }, {
        type: 'bar',
        name: 'Bananas',
        data: [129, 40, 40, 50],
        itemStyle: {
            borderColor: 'black',
            borderWidth: 2
        }
    }, {
        type: 'bar',
        name: 'Pears',
        data: [40, 60, 50, 89],
        itemStyle: {
            borderColor: 'black',
            borderWidth: 2
        }
    }],

    xAxis: {
        data: ['Q1', 'Q2', 'Q3', 'Q4'],
        axisLine: {
            color: 'black'
        },
        axisTick: {
            color: 'black'
        },
        axisLabel: {
            color: 'black'
        }
    },
    yAxis: {
        axisLine: {
            color: 'black'
        },
        axisTick: {
            color: 'black'
        },
        axisLabel: {
            color: 'black'
        },
        splitLine: {
            lineStyle: {
                color: 'black',
                type: 'dashed'
            }
        }
    },

    aria: {
        decal: {
            show: true,
            decals: [{
                dashArrayX: 0,
                dashArrayY: 0,
                color: 'black'
            }, {
                dashArrayX: 0,
                dashArrayY: 0,
                color: 'black'
            }, {
                dashArrayX: [1, 0],
                dashArrayY: [2, 5],
                symbolSize: 1,
                rotation: Math.PI / 6,
                color: 'black'
            }, {
                symbol: 'circle',
                dashArrayX: [[8, 8], [0, 8, 8, 0]],
                dashArrayY: [6, 0],
                symbolSize: 0.8,
                color: 'black'
            }]
        }
    },

    color: ['white', 'black', 'white', 'white']
};
