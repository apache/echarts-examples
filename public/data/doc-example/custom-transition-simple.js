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
            var fill = echarts.color.random();
            var stroke = '#000';
            var lineWidth = 2 + Math.round(Math.random() * 20);

            return {
                type: 'group',
                children: [{
                    type: 'rect',
                    x: pos[0] / 2,
                    y: pos[1],
                    shape: {
                        x: -width / 2,
                        y: -height / 2,
                        width: width,
                        height: height,
                        r: r
                    },
                    style: {
                        fill: fill,
                        stroke: stroke,
                        lineWidth: lineWidth
                    },
                    textContent: {
                        style: {
                            text: 'Has transition',
                            fontSize: 20
                        }
                    },
                    textConfig: {
                        position: 'bottom'
                    },
                    silent: true,
                    // Has transition
                    transition: ['shape', 'style', 'x', 'y']
                }, {
                    type: 'rect',
                    x: pos[0] / 2 + params.coordSys.width / 2,
                    y: pos[1],
                    shape: {
                        x: -width / 2,
                        y: -height / 2,
                        width: width,
                        height: height,
                        r: r
                    },
                    style: {
                        fill: fill,
                        stroke: stroke,
                        lineWidth: lineWidth
                    },
                    textContent: {
                        style: {
                            text: 'No transition',
                            fontSize: 20
                        }
                    },
                    textConfig: {
                        position: 'bottom'
                    },
                    silent: true,
                    // No transition
                    transition: []
                }]
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
