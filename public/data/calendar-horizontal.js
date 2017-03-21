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
        position: 'top'
    },
    visualMap: {
        min: 0,
        max: 1000,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        top: 'top'
    },

    calendar: [
    {
        range: '2017',
        cellSize: ['auto', 20]
    },
    {
        top: 260,
        range: '2016',
        cellSize: ['auto', 20]
    },
    {
        top: 450,
        range: '2015',
        cellSize: ['auto', 20],
        right: 5
    }],

    series: [{
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 0,
        data: getVirtulData(2017)
    }, {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 1,
        data: getVirtulData(2016)
    }, {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        calendarIndex: 2,
        data: getVirtulData(2015)
    }]

};
