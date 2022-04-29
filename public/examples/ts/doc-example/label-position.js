
app.configParameters = {
    position: {
        options: [
            'left', 'right', 'top', 'bottom',
            'inside',
            'insideTop', 'insideLeft', 'insideRight', 'insideBottom',
            'insideTopLeft', 'insideTopRight', 'insideBottomLeft', 'insideBottomRight'
        ]
    },
    align: {
        options: ['left', 'center', 'right']
    },
    verticalAlign: {
        options: ['top', 'middle', 'bottom']
    },
    distance: {
        min: 0,
        max: 100
    }
};

app.config = {
    position: 'top',
    align: 'center',
    verticalAlign: 'middle',
    distance: 5,
    onChange: function () {
        myChart.setOption({
            series: {
                type: 'scatter',
                label: {
                    position: app.config.position,
                    align: app.config.align,
                    verticalAlign: app.config.verticalAlign,
                    distance: app.config.distance
                }
            }
        });
    }
};

option = {
    series: [
        {
            type: 'scatter',
            symbolSize: 360,
            symbol: 'roundRect',
            data: [[1, 1]],
            label: {
                position: app.config.position,
                align: app.config.align,
                verticalAlign: app.config.verticalAlign,
                distance: app.config.distance,
                show: true,
                formatter: [
                    'Label Text',
                ].join('\n'),
                width: 200,
                height: 60,
                backgroundColor: 'rgba(0, 255, 255, 0.3)',
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
    ],
    xAxis: {
        max: 2
    },
    yAxis: {
        max: 2
    }
};
