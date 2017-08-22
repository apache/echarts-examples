
option = {
    series: [
        {
            type: 'scatter',
            data: [[0,0]],
            symbolSize: 1,
            label: {
                normal: {
                    show: true,
                    formatter: [
                        'The whole box is a {term|Text Block}, with',
                        'red border and grey background.',
                        '{fregment1|A Text Fregment} {fregment2|Another Text Fregment}',
                        'Text fregments can be customized.'
                    ].join('\n'),
                    backgroundColor: '#eee',
                    // borderColor: '#333',
                    borderColor: 'rgb(199,86,83)',
                    borderWidth: 2,
                    borderRadius: 5,
                    padding: 10,
                    color: '#000',
                    fontSize: 14,
                    shadowBlur: 3,
                    shadowColor: '#888',
                    shadowOffsetX: 0,
                    shadowOffsetY: 3,
                    lineHeight: 30,
                    rich: {
                        term: {
                            fontSize: 18,
                            color: 'rgb(199,86,83)'
                        },
                        fregment1: {
                            backgroundColor: '#000',
                            color: 'yellow',
                            padding: 5
                        },
                        fregment2: {
                            backgroundColor: '#339911',
                            color: '#fff',
                            borderRadius: 15,
                            padding: 5
                        }
                    }
                }
            }
        }
    ],
    xAxis: {
        axisLabel: {show: false},
        axisLine: {show: false},
        splitLine: {show: false},
        axisTick: {show: false},
        min: -1,
        max: 1
    },
    yAxis: {
        axisLabel: {show: false},
        axisLine: {show: false},
        splitLine: {show: false},
        axisTick: {show: false},
        min: -1,
        max: 1
    }
};