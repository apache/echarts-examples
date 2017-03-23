var graphData = [
    [
        1485878400000,
        260
    ],
    [
        1486137600000,
        200
    ],
    [
        1486569600000,
        279
    ],
    [
        1486915200000,
        847
    ],
    [
        1487347200000,
        241
    ],
    [
        1487779200000 + 3600 * 24 * 1000 * 15,
        411
    ],
    [
        1488124800000 + 3600 * 24 * 1000 * 23,
        985
    ]
];

var links = graphData.map(function (item, idx) {
    return {
        source: idx,
        target: idx + 1
    };
});
links.pop();

function getVirtulData(year) {
    year = year || '2017';
    var date = +echarts.number.parseDate(year + '-01-01');
    var end = +echarts.number.parseDate((+year + 1) + '-01-01');
    var dayTime = 3600 * 24 * 1000;
    var data = [];
    for (var time = date; time < end; time += dayTime) {
        data.push([
            echarts.format.formatTime('yyyy-MM-dd', time),
            Math.floor(Math.random() * 1000)
        ]);
    }
    return data;
}


option = {
    tooltip : {},
    calendar: {
        top: 'middle',
        left: 'center',
        orient: 'vertical',
        cellSize: 40,
        yearLabel: {
            margin: 50,
            textStyle: {
                fontSize: 30
            }
        },
        dayLabel: {
            firstDay: 1,
            nameMap: 'cn'
        },
        monthLabel: {
            nameMap: 'cn',
            margin: 15,
            textStyle: {
                fontSize: 20,
                color: '#999'
            }
        },
        range: ['2017-02', '2017-03-31']
    },
    visualMap: {
        min: 0,
        max: 1000,
        type: 'piecewise',
        left: 'center',
        bottom: 20,
        inRange: {
            color: ['#5291FF', '#C7DBFF']
        },
        seriesIndex: [1],
        orient: 'horizontal'
    },
    series: [{
        type: 'graph',
        edgeSymbol: ['none', 'arrow'],
        coordinateSystem: 'calendar',
        links: links,
        symbolSize: 15,
        calendarIndex: 0,
        itemStyle: {
            normal: {
                color: 'yellow',
                shadowBlue: 9,
                shadowOffsetX: 1.5,
                shadowOffsetY: 3,
                shadowColor: '#555'
            }
        },
        lineStyle: {
            normal: {
                color: '#D10E00',
                width: 1,
                opacity: 1
            }
        },
        data: graphData,
        z: 20
    }, {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: getVirtulData(2017)
    }]
};
