myChart.showLoading();

$.get('data/asset/data/masterPainterColorChoice.json', function (json) {
    myChart.hideLoading();

    var data = json[0].x.map(function (x, idx) {
        return [+x, +json[0].y[idx]];
    });

    myChart.setOption(option = {
        title: {
            text: 'Master Painter Color Choices Throughout History',
            subtext: 'Data From Plot.ly',
            left: 'right'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        xAxis: {
            type: 'value',
            splitLine: {
                show: false
            },
            scale: true,
            splitNumber: 5,
            max: 'dataMax',
            axisLabel: {
                formatter: function (val) {
                    return val + 's';
                }
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 360,
            interval: 60,
            name: 'Hue',
            splitLine: {
                show: false
            }
        },
        series: [{
            name: 'scatter',
            type: 'scatter',
            symbolSize: function (val, param) {
                return json[0].marker.size[param.dataIndex] / json[0].marker.sizeref;
            },
            itemStyle: {
                normal: {
                    color: function (param) {
                        return json[0].marker.color[param.dataIndex];
                    }
                }
            },
            data: data
        }]
    });
});