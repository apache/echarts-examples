
option = {
    series: [
        {
            type: 'scatter',
            symbolSize: 1,
            data: [{
                value: [0, 0],
                label: {
                    normal: {
                        show: true,
                        formatter: [
                            'Plain text',
                            '{textBorder|textBorderColor + textBorderWidth}',
                            '{textShadow|textShadowColor + textShadowBlur + textShadowOffsetX + textShadowOffsetY}',
                            '{bg|backgroundColor + borderRadius + padding}',
                            '{border|borderColor + borderWidth + borderRadius + padding}',
                            '{shadow|shadowColor + shadowBlur + shadowOffsetX + shadowOffsetY}'
                        ].join('\n'),
                        backgroundColor: '#eee',
                        borderColor: '#333',
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
                            textBorder: {
                                fontSize: 20,
                                textBorderColor: '#000',
                                textBorderWidth: 3,
                                color: '#fff'
                            },
                            textShadow: {
                                fontSize: 16,
                                textShadowBlur: 5,
                                textShadowColor: '#000',
                                textShadowOffsetX: 3,
                                textShadowOffsetY: 3,
                                color: '#fff'
                            },
                            bg: {
                                backgroundColor: '#339911',
                                color: '#fff',
                                borderRadius: 15,
                                padding: 5
                            },
                            border: {
                                color: '#000',
                                borderColor: '#449911',
                                borderWidth: 1,
                                borderRadius: 3,
                                padding: 5
                            },
                            shadow: {
                                backgroundColor: '#992233',
                                padding: 5,
                                color: '#fff',
                                shadowBlur: 5,
                                shadowColor: '#336699',
                                shadowOffsetX: 6,
                                shadowOffsetY: 6
                            }
                        }
                    }
                }
            }]
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