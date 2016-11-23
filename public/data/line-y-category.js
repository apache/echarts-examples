option = {
    legend: {
        data:['高度(km)与气温(°C)变化关系']
    },
    tooltip: {
        trigger: 'axis',
        formatter: "Temperature : <br/>{b}km : {c}°C"
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value',
        axisLabel: {
            formatter: '{value} °C'
        }
    },
    yAxis: {
        type: 'category',
        axisLine: {onZero: false},
        axisLabel: {
            formatter: '{value} km'
        },
        boundaryGap: false,
        data: ['0', '10', '20', '30', '40', '50', '60', '70', '80']
    },
    graphic: [
        {
            type: 'image',
            id: 'logo',
            right: 0,
            top: 0,
            z: -10,
            bounding: 'raw',
            origin: [125, 125],
            style: {
                image: 'http://echarts.baidu.com/images/favicon.png',
                width: 250,
                height: 250,
                opacity: 0.4
            }
        },
        {
            type: 'text',
            z: -10,
            right: 0,
            bottom: 0,
            rotation: Math.PI / 4,
            style: {
                fill: '#aaa',
                text: 'ECHARTS LINE',
                font: 'bold 34px Microsoft YaHei'
            }
        },
        {
            type: 'group',
            left: '10%',
            top: 'center',
            children: [
                {
                    type: 'rect',
                    z: 100,
                    left: 'center',
                    top: 'middle',
                    shape: {
                        width: 190,
                        height: 90
                    },
                    style: {
                        fill: '#fff',
                        stroke: '#999',
                        lineWidth: 2,
                        shadowBlur: 8,
                        shadowOffsetX: 3,
                        shadowOffsetY: 3,
                        shadowColor: 'rgba(0,0,0,0.3)'
                    }
                },
                {
                    type: 'text',
                    z: 100,
                    left: 'center',
                    top: 'middle',
                    style: {
                        fill: '#777',
                        text: [
                            '横轴表示温度，单位是°C',
                            '纵轴表示高度，单位是km',
                            '右上角有一个图片做的水印',
                            '这个文本块可以放在图中各',
                            '种位置'
                        ].join('\n'),
                        font: '14px Microsoft YaHei'
                    }
                }
            ]
        }
    ],
    series: [
        {
            name: '高度(km)与气温(°C)变化关系',
            type: 'line',
            smooth: true,
            lineStyle: {
                normal: {
                    width: 3,
                    shadowColor: 'rgba(0,0,0,0.4)',
                    shadowBlur: 10,
                    shadowOffsetY: 10
                }
            },
            data:[15, -50, -56.5, -46.5, -22.1, -2.5, -27.7, -55.7, -76.5]
        }
    ]
};

var rotation = 0;
setInterval(function () {
    myChart.setOption({
        graphic: {
            id: 'logo',
            rotation: (rotation += Math.PI / 360)
        }
    });
}, 30);