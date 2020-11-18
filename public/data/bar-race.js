/*
title: Bar Race
titleCN: 动态排序柱状图
category: bar
difficulty: 5
*/

var data = [];
for (let i = 0; i < 5; ++i) {
    data.push(Math.round(Math.random() * 200));
}

option = {
    xAxis: {
        max: 'dataMax',
    },
    yAxis: {
        type: 'category',
        data: ['A', 'B', 'C', 'D', 'E'],
        inverse: true,
        animationDuration: 300,
        animationDurationUpdate: 300,
        max: 2 // only the largest 3 bars will be displayed
    },
    series: [{
        realtimeSort: true,
        name: 'X',
        type: 'bar',
        data: data,
        label: {
            show: true,
            position: 'right',
            valueAnimation: true
        }
    }],
    legend: {
        show: true
    },
    animationDuration: 0,
    animationDurationUpdate: 3000,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear'
};

function run () {
    var data = option.series[0].data;
    for (var i = 0; i < data.length; ++i) {
        if (Math.random() > 0.9) {
            data[i] += Math.round(Math.random() * 2000);
        }
        else {
            data[i] += Math.round(Math.random() * 200);
        }
    }
    myChart.setOption(option);
}

setTimeout(function() {
    run();
}, 0);
setInterval(function () {
    run();
}, 3000);
