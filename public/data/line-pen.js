var symbolSize = 20;
var data = [[15, 0], [-50, 10], [-56.5, 20], [-46.5, 30], [-22.1, 40]];
var points = [];

option = {
    title: {
        text: 'Click to Add Points'
    },
    tooltip: {
        formatter: function (params) {
            var data = params.data || [0, 0];
            return data[0].toFixed(2) + ', ' + data[1].toFixed(2);
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        min: -60,
        max: 20,
        type: 'value',
        axisLine: {onZero: false}
    },
    yAxis: {
        min: 0,
        max: 40,
        type: 'value',
        axisLine: {onZero: false}
    },
    series: [
        {
            id: 'a',
            type: 'line',
            smooth: true,
            symbolSize: symbolSize,
            data: data
        }
    ]
};

var zr = myChart.getZr();


zr.on('click', function (params) {
    var pointInPixel = [params.offsetX, params.offsetY];
    var pointInGrid = myChart.convertFromPixel('grid', pointInPixel);

    if (myChart.containPixel('grid', pointInPixel)) {
        data.push(pointInGrid);

        myChart.setOption({
            series: [{
                id: 'a',
                data: data
            }]
        });
    }
});

zr.on('mousemove', function (params) {
    var pointInPixel = [params.offsetX, params.offsetY];
    zr.setCursorStyle(myChart.containPixel('grid', pointInPixel) ? 'copy' : 'default');
});
