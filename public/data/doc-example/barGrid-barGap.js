option = {
    xAxis: {
        data: ['a', 'b', 'c', 'd'],
        axisTick: {show: false},
        axisLabel: {
            formatter: 'barGap: \'-100%\''
        }
    },
    yAxis: {
        splitLine: {show: false}
    },
    animationDurationUpdate: 1200,
    series: [{
        type: 'bar',
        itemStyle: {
            normal: {
                color: '#ddd'
            }
        },
        silent: true,
        barWidth: 40,
        barGap: '-100%', // Make series be overlap
        data: [60, 60, 60, 60]
    }, {
        type: 'bar',
        barWidth: 40,
        z: 10,
        data: [45, 60, 13, 25]
    }]
};



var barGaps = ['30%', '-100%'];
var loopIndex = 0;

setInterval(function () {
    var barGap = barGaps[loopIndex];

    myChart.setOption({
        xAxis: {
            axisLabel: {
                formatter: 'barGap: \'' + barGap + '\''
            }
        },
        series: [{
            barGap: barGap
        }]
    });
    loopIndex = (loopIndex + 1) % barGaps.length;

}, 2000);