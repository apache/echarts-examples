option = {
    animationDurationUpdate: 1500,
    xAxis: {
        min: 0,
        max: 1
    },
    yAxis: {
        min: 0,
        max: 1
    },
    series: {
        type: 'custom',
        renderItem: function renderItem1(params, api) {
            var pos = api.coord([api.value(0), api.value(1)]);
            var width = 50 + Math.random() * 150;
            var height = 50 + Math.random() * 150;
            var r = Math.random() * 40;
            return {
                type: 'rect',
                x: pos[0],
                y: pos[1],
                shape: {
                    x: -width / 2,
                    y: -height / 2,
                    width: width,
                    height: height,
                    r: r
                },
                style: {
                    fill: echarts.color.random(),
                    stroke: '#000',
                    lineWidth: 2 + Math.round(Math.random() * 20)
                },
                transition: ['shape', 'style', 'x', 'y']
            };
        },
        data: [[Math.random(), Math.random()]]
    }
};

setInterval(function () {
    myChart.setOption({
        series: {
            data: [[Math.random(), Math.random()]]
        }
    });
}, 2000);
