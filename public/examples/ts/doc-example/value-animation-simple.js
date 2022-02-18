var Y_MAX = 1000;
var UPDATE_DURATION = 3000;
var initVal = makeRandomValue();

option = {
    xAxis: {
        data: ['a'],
        axisLabel: { show: false }
    },
    yAxis: {
        max: Y_MAX
    },
    legend: {
        bottom: 10
    },
    series: [{
        name: 'valueAnimation: true',
        type: 'bar',
        data: [initVal],
        label: {
            show: true,
            valueAnimation: true,
            position: 'top',
            fontSize: 40
        },
        barWidth: 20,
        barGap: '1000%',
        barCategoryGap: 200,
        animationDurationUpdate: UPDATE_DURATION * 0.7,
        animationEasingUpdate: 'linear'
    }, {
        name: 'valueAnimation: false',
        type: 'bar',
        data: [initVal],
        label: {
            show: true,
            valueAnimation: false,
            position: 'top',
            fontSize: 40
        },
        barWidth: 20,
        animationDurationUpdate: UPDATE_DURATION * 0.7,
        animationEasingUpdate: 'linear'
    }],
};

setInterval(function () {
    var newVal = makeRandomValue();
    myChart.setOption({
        series: [{
            data: [newVal]
        }, {
            data: [newVal]
        }]
    });
}, UPDATE_DURATION);

function makeRandomValue() {
    return Math.round(Math.random() * Y_MAX);
}