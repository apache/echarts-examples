var getVirtulData =  function(year) {

    year = year || '2017';

    var datas = [];

    var i, j;

    var arr31 = [1, 3, 5, 7, 8, 10, 12];
    var arr30 = [4, 6, 9, 11];
    for (i = 1; i <= 31; i++) {
        for (j = arr31.length - 1; j >= 0; j--) {
            datas.push([year + '-' + arr31[j] + '-' + i, Math.floor(Math.random() * 10000)]);
        }
    }
    for (i = 1; i <= 30; i++) {
        for (j = arr30.length - 1; j >= 0; j--) {
            datas.push([year + '-' + arr30[j] + '-' + i, Math.floor(Math.random() * 10000)]);
        }
    }
    for (i = 1; i <= 29; i++) {
        datas.push([year + '-2-' + i, Math.floor(Math.random() * 10000)]);
    }
    return datas;
};

option = {
    title: {
        top: 30,
        left: 'center',
        text: '2016年某人每天的步数',
        subtext: '数据纯属虚构'
    },
    tooltip : {},
    visualMap: {
        min: 0,
        max: 10000,
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 260,
        textStyle: {
            color: '#000'
        }
    },
    calendar: {
        top: 100,
        left: 60,
        range: '2016'
    },
    series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: getVirtulData(2016)
    }
};
