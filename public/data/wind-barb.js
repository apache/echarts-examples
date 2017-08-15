
$.getJSON('data/asset/data/wind-barb-hobart.json', function (rawData) {

    var weatherIcons = {
        'Showers': './data/asset/img/weather/showers_128.png',
        'Sunny': './data/asset/img/weather/sunny_128.png',
        'Cloudy': './data/asset/img/weather/cloudy_128.png'
    };

    var directionMap = {};
    echarts.util.each(
        ['W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE', 'E', 'ENE', 'NE', 'NNE', 'N', 'NNW', 'NW', 'WNW'],
        function (name, index) {
            directionMap[name] = Math.PI / 8 * index;
        }
    );

    var data = echarts.util.map(rawData.data, function (entry) {
        return [entry.time, entry.windSpeed, entry.R, entry.waveHeight];
    });
    var weatherData = echarts.util.map(rawData.forecast, function (entry) {
        return [entry.localDate, 0, weatherIcons[entry.skyIcon], entry.minTemp, entry.maxTemp];
    });

    var dims = {
        time: 0,
        windSpeed: 1,
        R: 2,
        waveHeight: 3,
        weatherIcon: 2,
        minTemp: 3,
        maxTemp: 4
    };
    var arrowSize = 18;
    var weatherIconSize = 45;

    function renderArrow(param, api) {
        var point = api.coord([
            api.value(dims.time),
            api.value(dims.windSpeed)
        ]);

        return {
            type: 'path',
            shape: {
                pathData: 'M31 16l-15-15v9h-26v12h26v9z',
                x: -arrowSize / 2,
                y: -arrowSize / 2,
                width: arrowSize,
                height: arrowSize
            },
            rotation: directionMap[api.value(dims.R)],
            position: point,
            style: api.style({
                stroke: '#555',
                lineWidth: 1
            })
        };
    }

    function renderWeather(param, api) {
        var point = api.coord([
            api.value(dims.time) +  + 3600 * 24 * 1000 / 2,
            0
        ]);

        return {
            type: 'group',
            children: [{
                type: 'image',
                style: {
                    image: api.value(dims.weatherIcon),
                    x: -weatherIconSize / 2,
                    y: -weatherIconSize / 2,
                    width: weatherIconSize,
                    height: weatherIconSize
                },
                position: [point[0], 110]
            }, {
                type: 'text',
                style: {
                    text: api.value(dims.minTemp) + ' - ' + api.value(dims.maxTemp) + '°',
                    textFont: api.font({fontSize: 14}),
                    textAlign: 'center',
                    textVerticalAlign: 'bottom'
                },
                position: [point[0], 80]
            }]
        };
    }

    option = {
        title: {
            text: '天气 风向 风速 海浪 预报',
            subtext: '示例数据源于 www.seabreeze.com.au',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                return [
                    echarts.format.formatTime('yyyy-MM-dd', params[0].value[dims.time])
                    + ' ' + echarts.format.formatTime('hh:mm', params[0].value[dims.time]),
                    '风速：' + params[0].value[dims.windSpeed],
                    '风向：' + params[0].value[dims.R],
                    '浪高：' + params[0].value[dims.waveHeight]
                ].join('<br>');
            }
        },
        grid: {
            top: 160,
            bottom: 125
        },
        xAxis: {
            type: 'time',
            maxInterval: 3600 * 1000 * 24,
            splitLine: {
                lineStyle: {
                    color: '#ddd'
                }
            }
        },
        yAxis: [{
            name: '风速（节）',
            nameLocation: 'middle',
            nameGap: 35,
            axisLine: {
                lineStyle: {
                    color: '#666'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#ddd'
                }
            }
        }, {
            name: '浪高（米）',
            nameLocation: 'middle',
            nameGap: 35,
            max: 6,
            axisLine: {
                lineStyle: {
                    color: '#015DD5'
                }
            },
            splitLine: {show: false}
        }, {
            axisLine: {show: false},
            axisTick: {show: false},
            axisLabel: {show: false},
            splitLine: {show: false}
        }],
        visualMap: {
            type: 'piecewise',
            // show: false,
            orient: 'horizontal',
            left: 'center',
            bottom: 10,
            pieces: [{
                gte: 17,
                color: '#18BF12',
                label: '大风（>=17节）'
            }, {
                gte: 11,
                lt: 17,
                color: '#f4e9a3',
                label: '中风（11  ~ 17 节）'
            }, {
                lt: 11,
                color: '#D33C3E',
                label: '微风（小于 11 节）'
            }],
            seriesIndex: 1,
            dimension: 1
        },
        dataZoom: [{
            type: 'inside',
            xAxisIndex: 0,
            minSpan: 5
        }, {
            type: 'slider',
            xAxisIndex: 0,
            minSpan: 5,
            height: 20,
            bottom: 50,
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '120%'
        }],
        series: [{
            type: 'line',
            yAxisIndex: 1,
            showSymbol: false,
            hoverAnimation: false,
            symbolSize: 10,
            areaStyle: {
                normal: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'rgba(88,160,253,1)'
                        }, {
                            offset: 0.5, color: 'rgba(88,160,253,0.7)'
                        }, {
                            offset: 1, color: 'rgba(88,160,253,0)'
                        }]
                    }
                }
            },
            lineStyle: {
                normal: {
                    color: 'rgba(88,160,253,1)'
                }
            },
            itemStyle: {
                normal: {
                    color: 'rgba(88,160,253,1)'
                }
            },
            encode: {
                x: dims.time,
                y: dims.waveHeight
            },
            data: data,
            z: 2
        }, {
            type: 'custom',
            renderItem: renderArrow,
            encode: {
                x: dims.time,
                y: dims.windSpeed
            },
            data: data,
            z: 10
        }, {
            type: 'line',
            symbol: 'none',
            encode: {
                x: dims.time,
                y: dims.windSpeed
            },
            lineStyle: {
                normal: {
                    color: '#aaa',
                    type: 'dotted'
                }
            },
            data: data,
            z: 1
        }, {
            type: 'custom',
            renderItem: renderWeather,
            data: weatherData,
            tooltip: {
                trigger: 'item',
                formatter: function (param) {
                    return param.value[dims.time] + ': '
                        + param.value[dims.minTemp] + ' - ' + param.value[dims.maxTemp] + '°';
                }
            },
            yAxisIndex: 2,
            z: 11
        }]
    };

    myChart.setOption(option);
});
