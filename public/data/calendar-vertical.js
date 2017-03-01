var getVirtulData =  function(year) {

    year = year || '2017';

    var datas = [];

    var i, j;

    var arr31 = [1, 3, 5, 7, 8, 10, 12];
    var arr30 = [4, 6, 9, 11];
    for (i = 1; i <= 31; i++) {
        for (j = arr31.length - 1; j >= 0; j--) {
            datas.push([year + '-' + arr31[j] + '-' + i, Math.floor(Math.random() * 1000)]);
        }
    }
    for (i = 1; i <= 30; i++) {
        for (j = arr30.length - 1; j >= 0; j--) {
            datas.push([year + '-' + arr30[j] + '-' + i, Math.floor(Math.random() * 1000)]);
        }
    }
    for (i = 1; i <= 29; i++) {
        datas.push([year + '-2-' + i, Math.floor(Math.random() * 1000)]);
    }
    return datas;
};

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
