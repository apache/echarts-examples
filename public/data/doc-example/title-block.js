var weatherIcons = {
    'Sunny': './data/asset/img/weather/sunny_128.png',
    'Cloudy': './data/asset/img/weather/cloudy_128.png',
    'Showers': './data/asset/img/weather/showers_128.png'
};

option = {
    series: [
        {
            type: 'scatter',
            data: [
                {
                    value: [0,0],
                    label: {
                        normal: {
                            formatter: [
                                '{tc|Center Title}{titleBg|}',
                                '  Content text xxxxxxxx {sunny|} xxxxxxxx {cloudy|}  ',
                                '{hr|}',
                                '  xxxxx {showers|} xxxxxxxx  xxxxxxxxx  '
                            ].join('\n'),
                            rich: {
                                titleBg: {
                                    align: 'right'
                                }
                            }
                        }
                    }
                },
                {
                    value: [0, 1],
                    label: {
                        normal: {
                            formatter: [
                                '{titleBg|Left Title}',
                                '  Content text xxxxxxxx {sunny|} xxxxxxxx {cloudy|}  ',
                                '{hr|}',
                                '  xxxxx {showers|} xxxxxxxx  xxxxxxxxx  '
                            ].join('\n')
                        }
                    }
                },
                {
                    value: [0, 2],
                    label: {
                        normal: {
                            formatter: [
                                '{titleBg|Right Title}',
                                '  Content text xxxxxxxx {sunny|} xxxxxxxx {cloudy|}  ',
                                '{hr|}',
                                '  xxxxx {showers|} xxxxxxxx  xxxxxxxxx  '
                            ].join('\n'),
                            rich: {
                                titleBg: {
                                    align: 'right'
                                }
                            }
                        }
                    }
                }
            ],
            symbolSize: 1,
            label: {
                normal: {
                    show: true,
                    backgroundColor: '#ddd',
                    borderColor: '#555',
                    borderWidth: 1,
                    borderRadius: 5,
                    color: '#000',
                    fontSize: 14,
                    rich: {
                        titleBg: {
                            backgroundColor: '#000',
                            height: 30,
                            borderRadius: [5, 5, 0, 0],
                            padding: [0, 10, 0, 10],
                            width: '100%',
                            color: '#eee'
                        },
                        tc: {
                            align: 'center',
                            color: '#eee'
                        },
                        hr: {
                            borderColor: '#777',
                            width: '100%',
                            borderWidth: 0.5,
                            height: 0
                        },
                        sunny: {
                            height: 30,
                            align: 'left',
                            backgroundColor: {
                                image: weatherIcons.Sunny
                            }
                        },
                        cloudy: {
                            height: 30,
                            align: 'left',
                            backgroundColor: {
                                image: weatherIcons.Cloudy
                            }
                        },
                        showers: {
                            height: 30,
                            align: 'left',
                            backgroundColor: {
                                image: weatherIcons.Showers
                            }
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
        min: 0,
        max: 2,
        inverse: true
    }
};