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
    tooltip: {
        position: 'top',
        formatter: function (p) {
            var format = echarts.format.formatTime('yyyy-MM-dd', p.data[0]);
            return format + ': ' + p.data[1];
        }
    },
    visualMap: {
        min: 0,
        max: 1000,
        calculable: true,
        orient: 'vertical',
        left: '670',
        top: 'center'
    },

    calendar: [
    {
        orient: 'vertical',
        range: '2015'
    },
    {
        left: 300,
        orient: 'vertical',
        range: '2016'
    },
    {
        left: 520,
        cellSize: [20, 'auto'],
        bottom: 10,
        orient: 'vertical',
        range: '2017',
        dayLabel: {
            margin: 5
        }
    }],

    series: [{
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 0,
        data: getVirtulData(2015)
    }, {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 1,
        data: getVirtulData(2016)
    }, {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 2,
        data: getVirtulData(2017)
    }]
};
