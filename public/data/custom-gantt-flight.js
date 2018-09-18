$.get('data/asset/data/airport-schedule.json', function (rawData) {
    myChart.setOption(option = makeOption(rawData));
});

function makeOption(rawData) {
    return {
        tooltip: {
        },
        animation: false,
        title: {
            text: 'Gantt of Airport Flight',
            left: 'center'
        },
        dataZoom: [{
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'weakFilter',
            height: 20,
            bottom: 0,
            start: -26,
            end: 26,
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            showDetail: false
        }, {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'weakFilter',
            start: -26,
            end: 26,
            zoomOnMouseWheel: false,
            moveOnMouseMove: true
        }, {
            type: 'slider',
            yAxisIndex: 0,
            zoomLock: true,
            width: 10,
            right: 10,
            top: 70,
            bottom: 20,
            start: 95,
            end: 100,
            handleSize: 0,
            showDetail: false,
        }, {
            type: 'inside',
            yAxisIndex: 0,
            start: 95,
            end: 100,
            zoomOnMouseWheel: false,
            moveOnMouseMove: true,
            moveOnMouseWheel: true
        }],
        grid: {
            show: true,
            top: 70,
            bottom: 20,
            left: 100,
            right: 20,
            backgroundColor: '#fff',
            borderWidth: 0
        },
        xAxis: {
            type: 'time',
            position: 'top',
            splitLine: {
                lineStyle: {
                    color: ['#E9EDFF']
                }
            },
            axisLine: {
                show: false
            },
            axisTick: {
                lineStyle: {
                    color: '#929ABA'
                }
            },
            axisLabel: {
                color: '#929ABA',
                inside: false,
                align: 'center'
            }
        },
        yAxis: {
            axisTick: {show: false},
            splitLine: {show: false},
            axisLine: {show: false},
            axisLabel: {show: false},
            min: 0,
            max: rawData.parkingApron.data.length - 1
        },
        series: [{
            type: 'custom',
            renderItem: renderGanttItem,
            dimensions: rawData.flight.dimensions,
            encode: {
                x: [1, 2],
                y: 0,
                tooltip: [0, 1, 2]
            },
            data: rawData.flight.data
        }, {
            type: 'custom',
            renderItem: renderAxisLabelItem,
            dimensions: rawData.parkingApron.dimensions,
            encode: {
                x: -1, // Then this series will not controlled by x.
                y: 0
            },
            data: echarts.util.map(rawData.parkingApron.data, function (item, index) {
                return [index].concat(item);
            })
        }]
    };
}

function renderGanttItem(params, api) {
    var categoryIndex = api.value(0);
    var arrival = api.coord([api.value(1), categoryIndex]);
    var departure = api.coord([api.value(2), categoryIndex]);

    var barLength = departure[0] - arrival[0];
    // Get the heigth corresponds to length 1 on y axis.
    var barHeight = api.size([0, 1])[1] * 0.6;
    var x = arrival[0];
    var y = arrival[1] - barHeight;

    var flightNumber = api.value(3) + '';
    var flightNumberWidth = echarts.format.getTextRect(flightNumber).width;
    var text = (barLength > flightNumberWidth + 40 && x + barLength >= 180)
        ? flightNumber : '';

    var rectNormal = clipRectByRect(params, {
        x: x, y: y, width: barLength, height: barHeight
    });
    var rectVIP = clipRectByRect(params, {
        x: x, y: y, width: (barLength) / 2, height: barHeight
    });
    var rectText = clipRectByRect(params, {
        x: x, y: y, width: barLength, height: barHeight
    });

    return {
        type: 'group',
        children: [{
            type: 'rect',
            ignore: !rectNormal,
            shape: rectNormal,
            style: api.style()
        }, {
            type: 'rect',
            ignore: !rectVIP && !api.value(4),
            shape: rectVIP,
            style: api.style({fill: '#ddb30b'})
        }, {
            type: 'rect',
            ignore: !rectText,
            shape: rectText,
            style: api.style({
                fill: 'transparent',
                stroke: 'transparent',
                text: text,
                textFill: '#fff'
            })
        }]
    };
}

function renderAxisLabelItem(params, api) {
    var y = api.coord([0, api.value(0)])[1];
    if (y < params.coordSys.y + 5) {
        return;
    }
    return {
        type: 'group',
        position: [
            10,
            y
        ],
        children: [{
            type: 'path',
            shape: {
                d: 'M0,0 L0,-20 L30,-20 C42,-20 38,-1 50,-1 L70,-1 L70,0 Z',
                x: 0,
                y: -20,
                width: 90,
                height: 20,
                layout: 'cover'
            },
            style: {
                fill: '#368c6c'
            }
        }, {
            type: 'text',
            style: {
                x: 24,
                y: -3,
                text: api.value(1),
                textVerticalAlign: 'bottom',
                textAlign: 'center',
                textFill: '#fff'
            }
        }, {
            type: 'text',
            style: {
                x: 75,
                y: -2,
                textVerticalAlign: 'bottom',
                textAlign: 'center',
                text: api.value(2),
                textFill: '#000'
            }
        }]
    };
}


function clipRectByRect(params, rect) {
    return echarts.graphic.clipRectByRect(rect, {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height
    });
}
