/*
title: Calendar Pie
category: 'calendar, pie'
titleCN: 日历饼图
difficulty: 6
*/

const cellSize = [80, 80];
const pieRadius = 30;

type DataItem = [string, number];

function getVirtulData() {
    let date = +echarts.number.parseDate('2017-02-01');
    let end = +echarts.number.parseDate('2017-03-01');
    let dayTime = 3600 * 24 * 1000;
    let data: DataItem[] = [];
    for (let time = date; time < end; time += dayTime) {
        data.push([
            echarts.format.formatTime('yyyy-MM-dd', time),
            Math.floor(Math.random() * 10000)
        ]);
    }
    return data;
}

function getPieSeries(scatterData: DataItem[], chart: echarts.ECharts) {
    return scatterData.map(function (item, index) {
        var center = chart.convertToPixel('calendar', item);
        return {
            id: index + 'pie',
            type: 'pie',
            center: center,
            label: {
                normal: {
                    formatter: '{c}',
                    position: 'inside'
                }
            },
            radius: pieRadius,
            data: [
                {name: '工作', value: Math.round(Math.random() * 24)},
                {name: '娱乐', value: Math.round(Math.random() * 24)},
                {name: '睡觉', value: Math.round(Math.random() * 24)}
            ]
        };
    });
}

function getPieSeriesUpdate(scatterData: DataItem[], chart: echarts.ECharts) {
    return scatterData.map(function (item, index) {
        var center = chart.convertToPixel('calendar', item);
        return {
            id: index + 'pie',
            center: center
        };
    });
}

var scatterData = getVirtulData();

option = {
    tooltip : {},
    legend: {
        data: ['Work', 'Entertainment', 'Sleep'],
        bottom: 20
    },
    calendar: {
        top: 'middle',
        left: 'center',
        orient: 'vertical',
        cellSize: cellSize,
        yearLabel: {
            show: false,
            fontSize: 30
        },
        dayLabel: {
            margin: 20,
            firstDay: 1,
            nameMap: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        monthLabel: {
            show: false
        },
        range: ['2017-02']
    },
    series: [{
        id: 'label',
        type: 'scatter',
        coordinateSystem: 'calendar',
        symbolSize: 1,
        label: {
            show: true,
            formatter: function (params) {
                return echarts.format.formatTime('dd', params.value[0]);
            },
            offset: [-cellSize[0] / 2 + 10, -cellSize[1] / 2 + 10],
            fontSize: 14
        },
        data: scatterData
    }]
};

let pieInitialized: boolean;
setTimeout(function () {
    pieInitialized = true;
    myChart.setOption<echarts.EChartsOption>({
        series: getPieSeries(scatterData, myChart)
    });
}, 10);

app.onresize = function () {
    if (pieInitialized) {
        myChart.setOption<echarts.EChartsOption>({
            series: getPieSeriesUpdate(scatterData, myChart)
        });
    }
};

export {}