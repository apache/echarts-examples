
var posList = [
    'left', 'right', 'top', 'bottom',
    'inside',
    'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
    'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
];

app.configParameters = {
    position: {
        options: echarts.util.reduce(posList, function (map, pos) {
            map[pos] = pos;
            return map;
        }, {})
    },
    distance: {
        min: 0,
        max: 100
    }
};

app.config = {
    position: 'top',
    distance: 20,
    onChange: function () {
        myChart.setOption({
            series: {
                type: 'scatter',
                label: {
                    normal: {
                        position: app.config.position,
                        distance: app.config.distance
                    }
                }
            }
        });
    }
};



option = {
    series: [
        {
            type: 'scatter',
            symbolSize: 160,
            symbol: 'roundRect',
            data: [[1, 1]],
            label: {
                normal: {

                    position: app.config.position,
                    distance: app.config.distance,

                    show: true,
                    formatter: [
                        'Label Text',
                    ].join('\n'),
                    backgroundColor: '#eee',
                    borderColor: '#555',
                    borderWidth: 2,
                    borderRadius: 5,
                    padding: 10,
                    fontSize: 18,
                    shadowBlur: 3,
                    shadowColor: '#888',
                    shadowOffsetX: 0,
                    shadowOffsetY: 3,
                    textBorderColor: '#000',
                    textBorderWidth: 3,
                    color: '#fff'
                }
            }
        }
    ],
    xAxis: {
        max: 2
    },
    yAxis: {
        max: 2
    }
};
