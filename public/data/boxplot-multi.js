
// Generate data.
data = [];
for (var seriesIndex = 0; seriesIndex < 5; seriesIndex++) {
    var seriesData = [];
    for (var i = 0; i < 18; i++) {
        var cate = [];
        for (var j = 0; j < 100; j++) {
            cate.push(Math.random() * 200);
        }
        seriesData.push(cate);
    }
    data.push(echarts.dataTool.prepareBoxplotData(seriesData));
}


option = {
    title: {
        text: 'Multiple Categories',
        left: 'center',
    },
    legend: {
        y: '10%',
        data: ['category0', 'category1', 'category2', 'category3']
    },
    tooltip: {
        trigger: 'item',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        left: '10%',
        top: '20%',
        right: '10%',
        bottom: '15%'
    },
    xAxis: {
        type: 'category',
        data: data[0].axisData,
        boundaryGap: true,
        nameGap: 30,
        splitArea: {
            show: true
        },
        axisLabel: {
            formatter: 'expr {value}'
        },
        splitLine: {
            show: false
        }
    },
    yAxis: {
        type: 'value',
        name: 'Value',
        min: -400,
        max: 600,
        splitArea: {
            show: false
        }
    },
    dataZoom: [
        {
            type: 'inside',
            start: 0,
            end: 20
        },
        {
            show: true,
            height: 20,
            type: 'slider',
            top: '90%',
            xAxisIndex: [0],
            start: 0,
            end: 20
        }
    ],
    series: [
        {
            name: 'category0',
            type: 'boxplot',
            data: data[0].boxData,
            tooltip: {formatter: formatter}
        },
        {
            name: 'category1',
            type: 'boxplot',
            data: data[1].boxData,
            tooltip: {formatter: formatter}
        },
        {
            name: 'category2',
            type: 'boxplot',
            data: data[2].boxData,
            tooltip: {formatter: formatter}
        }
    ]
};

function formatter(param) {
    return [
        'Experiment ' + param.name + ': ',
        'upper: ' + param.data[0],
        'Q1: ' + param.data[1],
        'median: ' + param.data[2],
        'Q3: ' + param.data[3],
        'lower: ' + param.data[4]
    ].join('<br/>')
}