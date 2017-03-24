var indices = {
    name: 0,
    group: 1,
    id: 16
};
var schema = [
    {name: 'name', index: 0},
    {name: 'group', index: 1},
    {name: 'protein', index: 2},
    {name: 'calcium', index: 3},
    {name: 'sodium', index: 4},
    {name: 'fiber', index: 5},
    {name: 'vitaminc', index: 6},
    {name: 'potassium', index: 7},
    {name: 'carbohydrate', index: 8},
    {name: 'sugars', index: 9},
    {name: 'fat', index: 10},
    {name: 'water', index: 11},
    {name: 'calories', index: 12},
    {name: 'saturated', index: 13},
    {name: 'monounsat', index: 14},
    {name: 'polyunsat', index: 15},
    {name: 'id', index: 16}
];

var axisColors = {
    'xAxisLeft': '#2A8339',
    'xAxisRight': '#367DA6',
    'yAxisTop': '#A68B36',
    'yAxisBottom': '#BD5692'
};
var colorBySchema = {};

var fieldIndices = schema.reduce(function (obj, item) {
    obj[item.name] = item.index;
    return obj;
}, {});

var groupCategories = [];
var groupColors = [];
var data;

// zlevel 为 1 的层开启尾迹特效
myChart.getZr().configLayer(1, {
    motionBlur: 0.5
});


function normalizeData(originData) {
    var groupMap = {};
    originData.forEach(function (row) {
        var groupName = row[indices.group];
        if (!groupMap.hasOwnProperty(groupName)) {
            groupMap[groupName] = 1;
        }
    });

    originData.forEach(function (row) {
        row.forEach(function (item, index) {
            if (index !== indices.name
                && index !== indices.group
                && index !== indices.id
            ) {
                // Convert null to zero, as all of them under unit "g".
                row[index] = parseFloat(item) || 0;
            }
        });
    });

    for (var groupName in groupMap) {
        if (groupMap.hasOwnProperty(groupName)) {
            groupCategories.push(groupName);
        }
    }
    var hStep = Math.round(300 / (groupCategories.length - 1));
    for (var i = 0; i < groupCategories.length; i++) {
        groupColors.push(echarts.color.modifyHSL('#5A94DF', hStep * i));
    }

    return originData;
}

function makeAxis(dimIndex, id, name, nameLocation) {
    var axisColor = axisColors[id.split('-')[dimIndex]];
    colorBySchema[name] = axisColor;
    return {
        id: id,
        name: name,
        nameLocation: nameLocation,
        nameGap: nameLocation === 'middle' ? 30 : 10,
        gridId: id,
        splitLine: {show: false},
        axisLine: {
            lineStyle: {
                color: axisColor
            }
        },
        axisLabel: {
            textStyle: {
                color: axisColor
            }
        },
        axisTick: {
            lineStyle: {
                color: axisColor
            }
        }
    };
}

function makeSeriesData(xLeftOrRight, yTopOrBottom) {
    return data.map(function (item, idx) {
        var schemaX = app.config[xLeftOrRight];
        var schemaY = app.config[yTopOrBottom];
        return [
            item[fieldIndices[schemaX]], // 0: xValue
            item[fieldIndices[schemaY]], // 1: yValue
            item[1],                     // 2: group
            item[0],                     // 3: name
            schemaX,                     // 4: schemaX
            schemaY,                     // 5: schemaY
            idx                          // 6
        ];
    });
}

function makeSeries(xLeftOrRight, yTopOrBottom) {
    var id = xLeftOrRight + '-' + yTopOrBottom;
    return {
        zlevel: 1,
        type: 'scatter',
        name: 'nutrients',
        xAxisId: id,
        yAxisId: id,
        symbolSize: 8,
        itemStyle: {
            emphasis: {
                color: '#fff'
            }
        },
        animationThreshold: 5000,
        progressiveThreshold: 5000,
        data: makeSeriesData(xLeftOrRight, yTopOrBottom)
    };
}

function makeDataZoom(opt) {
    return echarts.util.extend({
        type: 'slider',
        fillerColor: 'rgba(255,255,255,0.1)',
        borderColor: '#777',
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '60%',
        handleStyle: {
            color: '#aaa'
        },
        textStyle: {
            color: '#aaa'
        },
        filterMode: 'empty',
        realtime: false
    }, opt);
}

function tooltipFormatter(params) {
    // Remove duplicate by data name.
    var mapByDataName = {};
    var mapOnDim = {x: {}, y: {}, xy: {}};
    echarts.util.each(params, function (item) {
        var data = item.data;
        var dataName = data[3];
        var mapItem = mapByDataName[dataName] || (mapByDataName[dataName] = {});
        mapItem[data[4]] = data[0];
        mapItem[data[5]] = data[1];
        mapOnDim[item.axisDim][dataName] = mapItem;
    });
    echarts.util.each(mapByDataName, function (mapItem, dataName) {
        if (mapOnDim.x[dataName] && mapOnDim.y[dataName]) {
            mapOnDim.xy[dataName] = mapItem;
            delete mapOnDim.x[dataName];
            delete mapOnDim.y[dataName];
        }
    });
    var resultHTML = [];
    echarts.util.each([['xy', 'CROSS'], ['x', 'V LINE'], ['y', 'H LINE']], function (dimDefine) {
        var html = [];
        echarts.util.each(mapOnDim[dimDefine[0]], function (mapItem, dataName) {
            var valuesHTML = [];
            echarts.util.each(mapItem, function (value, dataName) {
                valuesHTML.push(
                    '<span style="color:' + colorBySchema[dataName] + '">'
                        + dataName
                    + '</span>: ' + value
                );
            });
            html.push('<div style="margin: 10px 0">' + dataName + '<br/>' + valuesHTML.join('<br/>') + '</div>');
        });
        html.length && resultHTML.push(
            '<div style="margin: 10px 0">'
            + '<div style="font-size: 16px; color: #aaa">POINTS ON ' + dimDefine[1] + '</div>'
            + html.join('')
            + '</div>'
        );
    });
    return resultHTML.join('');
}

function getOption(data) {
    var gridWidth = '35%';
    var gridHeight = '35%';
    var gridLeft = 80;
    var gridRight = 50;
    var gridTop = 50;
    var gridBottom = 80;

    return {
        backgroundColor: '#2c343c',
        tooltip: {
            trigger: 'none',
            padding: [10, 20, 10, 20],
            backgroundColor: 'rgba(44,52,60,0.7)',
            borderColor: '#ccc',
            borderWidth: 2,
            borderRadius: 4,
            transitionDuration: 0,
            extraCssText: 'width: 300px; white-space: normal',
            textStyle: {
                fontSize: 12
            },
            position: function (pos, params, el, elRect, size) {
                var obj = {};
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 60;
                obj[['top', 'bottom'][+(pos[1] < size.viewSize[1] / 2)]] = 20;
                return obj;
            },
            formatter: tooltipFormatter
        },
        axisPointer: {
            show: true,
            snap: true,
            lineStyle: {
                type: 'dashed'
            },
            label: {
                show: true,
                margin: 6,
                backgroundColor: '#556',
                textStyle: {
                    color: '#fff'
                }
            },
            link: [{
                xAxisId: ['xAxisLeft-yAxisTop', 'xAxisLeft-yAxisBottom']
            }, {
                xAxisId: ['xAxisRight-yAxisTop', 'xAxisRight-yAxisBottom']
            }, {
                yAxisId: ['xAxisLeft-yAxisTop', 'xAxisRight-yAxisTop']
            }, {
                yAxisId: ['xAxisLeft-yAxisBottom', 'xAxisRight-yAxisBottom']
            }]
        },
        xAxis: [
            makeAxis(0, 'xAxisLeft-yAxisTop', 'carbohydrate', 'middle'),
            makeAxis(0, 'xAxisLeft-yAxisBottom', 'carbohydrate', 'middle'),
            makeAxis(0, 'xAxisRight-yAxisTop', 'potassium', 'middle'),
            makeAxis(0, 'xAxisRight-yAxisBottom', 'potassium', 'middle')
        ],
        yAxis: [
            makeAxis(1, 'xAxisLeft-yAxisTop', 'calcium', 'end'),
            makeAxis(1, 'xAxisLeft-yAxisBottom', 'fiber', 'end'),
            makeAxis(1, 'xAxisRight-yAxisTop', 'calcium', 'end'),
            makeAxis(1, 'xAxisRight-yAxisBottom', 'fiber', 'end')
        ],
        grid: [{
            id: 'xAxisLeft-yAxisTop',
            left: gridLeft,
            top: gridTop,
            width: gridWidth,
            height: gridHeight
        }, {
            id: 'xAxisLeft-yAxisBottom',
            left: gridLeft,
            bottom: gridBottom,
            width: gridWidth,
            height: gridHeight
        }, {
            id: 'xAxisRight-yAxisTop',
            right: gridRight,
            top: gridTop,
            width: gridWidth,
            height: gridHeight
        }, {
            id: 'xAxisRight-yAxisBottom',
            right: gridRight,
            bottom: gridBottom,
            width: gridWidth,
            height: gridHeight
        }],
        dataZoom: [
            makeDataZoom({
                width: gridWidth,
                height: 20,
                left: gridLeft,
                bottom: 10,
                xAxisIndex: [0, 1]
            }),
            makeDataZoom({
                width: gridWidth,
                height: 20,
                right: gridRight,
                bottom: 10,
                xAxisIndex: [2, 3]
            }),
            makeDataZoom({
                orient: 'vertical',
                width: 20,
                height: gridHeight,
                left: 10,
                top: gridTop,
                yAxisIndex: [0, 2]
            }),
            makeDataZoom({
                orient: 'vertical',
                width: 20,
                height: gridHeight,
                left: 10,
                bottom: gridBottom,
                yAxisIndex: [1, 3]
            })
        ],
        visualMap: [{
            show: false,
            type: 'piecewise',
            categories: groupCategories,
            dimension: 2,
            inRange: {
                color: groupColors //['#d94e5d','#eac736','#50a3ba']
            },
            outOfRange: {
                color: ['#ccc'] //['#d94e5d','#eac736','#50a3ba']
            },
            top: 20,
            textStyle: {
                color: '#fff'
            },
            realtime: false
        }],
        series: [
            makeSeries('xAxisLeft', 'yAxisTop'),
            makeSeries('xAxisLeft', 'yAxisBottom'),
            makeSeries('xAxisRight', 'yAxisTop'),
            makeSeries('xAxisRight', 'yAxisBottom')
        ],
        animationEasingUpdate: 'cubicInOut',
        animationDurationUpdate: 2000
    };
}

var fieldNames = schema.map(function (item) {
    return item.name;
}).slice(2);

app.config = {
    xAxisLeft: 'carbohydrate',
    yAxisTop: 'calcium',
    xAxisRight: 'potassium',
    yAxisBottom: 'fiber',
    onChange: function () {
        if (data) {
            colorBySchema[app.config.xAxisLeft] = axisColors.xAxisLeft;
            colorBySchema[app.config.xAxisRight] = axisColors.xAxisRight;
            colorBySchema[app.config.yAxisTop] = axisColors.yAxisTop;
            colorBySchema[app.config.yAxisBottom] = axisColors.yAxisBottom;

            myChart.setOption({
                xAxis: [{
                    name: app.config.xAxisLeft
                }, {
                    name: app.config.xAxisLeft
                }, {
                    name: app.config.xAxisRight
                }, {
                    name: app.config.xAxisRight
                }],
                yAxis: [{
                    name: app.config.yAxisTop
                }, {
                    name: app.config.yAxisBottom
                }, {
                    name: app.config.yAxisTop
                }, {
                    name: app.config.yAxisBottom
                }],
                series: [{
                    data: makeSeriesData('xAxisLeft', 'yAxisTop')
                }, {
                    data: makeSeriesData('xAxisLeft', 'yAxisBottom')
                }, {
                    data: makeSeriesData('xAxisRight', 'yAxisTop')
                }, {
                    data: makeSeriesData('xAxisRight', 'yAxisBottom')
                }]
            });
        }
    }
};

app.configParameters = {
    xAxisLeft: {
        options: fieldNames
    },
    xAxisRight: {
        options: fieldNames
    },
    yAxisTop: {
        options: fieldNames
    },
    yAxisBottom: {
        options: fieldNames
    }
};

$.get('./data/asset/data/nutrients.json', function (originData) {
    data = normalizeData(originData).slice(0, 1000);

    myChart.setOption(option = getOption(data));
});
