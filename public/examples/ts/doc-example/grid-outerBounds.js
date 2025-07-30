app.config = {};
app.configParameters = {};

app.config.showRectIndicators = true;
app.configParameters.showRectIndicators = {options: [false, true]};
app.config.xAxisType = 'value';
app.configParameters.xAxisType = {options: ['value', 'category', 'time', 'log']},
app.config.yAxisType = 'value';
app.configParameters.yAxisType = {options: ['value', 'category', 'time', 'log']};
app.config.containLabel = false;
app.configParameters.containLabel = {options: [false, true]};
app.config.outerBoundsMode = 'auto';
app.configParameters.outerBoundsMode = {options: ['auto', 'same', 'none']};
app.config.chartDataLength = 'medium_data';
app.configParameters.chartDataLength = {options: ['small_data', 'medium_data', 'big_data']};
app.config.xAxisNameLocation = 'center';
app.configParameters.xAxisNameLocation = {options: ['center', 'start', 'end']};
app.config.yAxisNameLocation = 'center';
app.configParameters.yAxisNameLocation = {options: ['end', 'center', 'start']};
app.config.xAxisLabelRotate = 0;
app.configParameters.xAxisLabelRotate = {options: [0, 30, 45, 60, 90]};
app.config.yAxisLabelRotate = 0;
app.configParameters.yAxisLabelRotate = {options: [0, 30, 45, 60, 90]};
app.config.hideOverlap = false;
app.configParameters.hideOverlap = {options: [true, false]};
app.config.yAxisCount = 1;
app.configParameters.yAxisCount = {options: [1, 2]};
app.config['grid.left'] = 70;
app.config['grid.right'] = 260;
app.config['grid.top'] = 50;
app.config['grid.bottom'] = 45;
app.configParameters['grid.left'] = {min: 0, max: 500};
app.configParameters['grid.right'] = {min: 0, max: 500};
app.configParameters['grid.top'] = {min: 0, max: 500};
app.configParameters['grid.bottom'] = {min: 0, max: 500};
app.config['grid.outerBounds.left'] = 0;
app.config['grid.outerBounds.right'] = 0;
app.config['grid.outerBounds.top'] = 0;
app.config['grid.outerBounds.bottom'] = 0;
app.configParameters['grid.outerBounds.left'] = {min: 0, max: 500};
app.configParameters['grid.outerBounds.right'] = {min: 0, max: 500};
app.configParameters['grid.outerBounds.top'] = {min: 0, max: 500};
app.configParameters['grid.outerBounds.bottom'] = {min: 0, max: 500};

/**
 * Initail echarts option.
 */
option = createOption();

app.config.onChange = function () {
    chartSetOptionUpdate();
};


function calcOuterBoundsIndicatorShape() {
    // This implementation is an copy of echarts internal logic.
    var gridOuterBoundsParsed = {};
    var parsedOuterBoundsMode = app.config.outerBoundsMode;
    if (app.config.containLabel) {
        parsedOuterBoundsMode = 'same';
    }
    if (parsedOuterBoundsMode === 'none') {
        // 'none' effectively indicates outerBounds infinity.
        gridOuterBoundsParsed.left = -1000;
        gridOuterBoundsParsed.top = -1000;
        gridOuterBoundsParsed.right = -1000;
        gridOuterBoundsParsed.bottom = -1000;
    }
    else if (parsedOuterBoundsMode == 'same') {
        gridOuterBoundsParsed.left = app.config['grid.left'];
        gridOuterBoundsParsed.top = app.config['grid.top'];
        gridOuterBoundsParsed.right = app.config['grid.right'];
        gridOuterBoundsParsed.bottom = app.config['grid.bottom'];
    }
    else {
        gridOuterBoundsParsed = {
            left: app.config['grid.outerBounds.left'],
            top: app.config['grid.outerBounds.top'],
            right: app.config['grid.outerBounds.right'],
            bottom: app.config['grid.outerBounds.bottom']
        };
    }
    return gridOuterBoundsParsed;
}

function makeAxisName({xy, idx}) {
    return xy + 'Axis_' + idx + 'name';
}

function makeIndicatorOption() {
    var gridOuterBoundsParsed = calcOuterBoundsIndicatorShape();
    var ignore = !app.config.showRectIndicators;

    var width = 0;
    var height = 0;
    if (myChart) {
        width = myChart.getWidth();
        height = myChart.getHeight();
    }
    else {
        ignore = true;
    }

    return [
        {
            type: 'rect',
            id: 'grid_box_indicator',
            ignore,
            shape: {
                x: app.config['grid.left'],
                y: app.config['grid.top'],
                width: width - app.config['grid.left'] - app.config['grid.right'],
                height: height - app.config['grid.top'] - app.config['grid.bottom'],
            },
            style: {
                fill: 'rgba(0,0,100,0.1)'
            },
            silent: true,
            textContent: {
                type: 'text',
                style: {
                    text: 'grid.t/r/b/l/w/h rect',
                    stroke: '#fff',
                    lineWidth: 2,
                    fill: '#555',
                    fontSize: 10,
                }
            },
            textConfig: {
                position: 'insideTopRight',
                distance: 0,
            },
        },
        {
            type: 'rect',
            id: 'grid_outerBounds_indicator',
            ignore,
            shape: {
                x: gridOuterBoundsParsed.left,
                y: gridOuterBoundsParsed.top,
                width: width - gridOuterBoundsParsed.left - gridOuterBoundsParsed.right,
                height: height - gridOuterBoundsParsed.top - gridOuterBoundsParsed.bottom
            },
            style: {
                fill: 'rgba(0,80,0,0.1)'
            },
            silent: true,
            textContent: {
                type: 'text',
                style: {
                    text: 'grid.outerBounds.t/r/b/l/w/h rect',
                    stroke: '#fff',
                    lineWidth: 2,
                    fill: '#555',
                    fontSize: 10,
                }
            },
            textConfig: {
                position: 'insideTopRight',
                distance: 0,
            },
        }
    ];
}

function makeSeries() {
    var dataLength = app.config.chartDataLength;

    function makeSeriesData(idx) {
        var xType = app.config.xAxisType;
        var yType = app.config.yAxisType;

        function getCategory(idx) {
            var offsetIdx = idx;
            if (dataLength === 'big_data') {
                return 'cat_' + String(offsetIdx).padStart(8, '0') + '_longlabel';
            } else if (dataLength === 'medium_data') {
                return 'cat_medium_' + String(offsetIdx).padStart(4, '0');
            }
            return 'cat' + offsetIdx;
        }

        function getTime(idx) {
            var base = +new Date(2022, 11, 1); // 2022-12-01
            var offsetIdx = idx;
            return new Date(base + offsetIdx * 24 * 3600 * 1000).toISOString().slice(0, 10);
        }

        function getBigValue(idx) {
            var offsetIdx = idx;
            if (dataLength === 'big_data') {
                return 10000000000 + offsetIdx * 1000000000;
            } else if (dataLength === 'medium_data') {
                return 100000 + offsetIdx * 10000;
            } else if (dataLength === 'small_data') {
                return 10 + offsetIdx * 15; // e.g., 10, 25, 40, 55, 70 (all < 100 for 5 points)
            }
            return Math.pow(10, offsetIdx + 1);
        }

        function genData(xType, yType, count) {
            var randomData = [
                0.79, 0.03, 0.25, 0.68, 0.33, 0.04, 0.79, 0.47, 0.89, 0.13, 0.72, 1, 0.17, 0.51, 0.84,
                0.56, 0.6, 0.3, 0.03, 0.53, 0.7, 0.38, 0.93, 0.85, 0.87, 0.29, 0.51, 0.6, 0.64, 0.15,
                0.64, 0.06, 0.57, 0.84, 0.26, 0.73, 0.62, 0.75, 0.7, 0.85, 0.53, 0.97, 0.54, 0.87,
                0.21, 0.01, 0.25, 0.72, 0.31, 0.3
            ];
            var randomDataIdx = 0;
            var data = [];
            for (var i = 0; i < count; ++i) {
                var x, y;
                if (xType === 'category') x = getCategory(i);
                else if (xType === 'time') x = getTime(i);
                else if (xType === 'log') x = getBigValue(i);
                else x = getBigValue(i);
                if (yType === 'category') y = getCategory(i);
                else if (yType === 'time') y = getTime(i + 1);
                else if (yType === 'log') y = getBigValue(i);
                else y = getBigValue(i);
                // Add randomness to y value if it's a number, based on data size
                if (typeof y === 'number') {
                    if (dataLength === 'small_data') {
                        y += randomData[randomDataIdx++] * 10;
                    } else if (dataLength === 'medium_data') {
                        y += randomData[randomDataIdx++] * 1000;
                    } else if (dataLength === 'big_data') {
                        y += randomData[randomDataIdx++] * 1e9;
                    }
                }
                data.push([x, y]);
            }
            return data;
        }
        // Always use 5 points for both series, only label/value length changes
        return genData(xType, yType, 5);
    }

    var list = [];
    // Always add the first series on the first yAxis
    var seriesData0 = makeSeriesData(0);
    list.push({
        symbolSize: 10,
        name: 'series_0',
        data: seriesData0,
        type: 'line',
        xAxisId: 0,
        yAxisId: 0
    });
    // If two yAxes, add a second series on the second yAxis
    if (app.config.yAxisCount === 2) {
        var seriesData1 = makeSeriesData(1);
        list.push({
            symbolSize: 10,
            name: 'series_1',
            data: seriesData1,
            type: 'line',
            xAxisId: 0,
            yAxisId: 1
        });
    }
    return list;
} // End of makeSeries

function makeXAxisOption() {
    return [{
        id: 0,
        type: app.config.xAxisType,
        name: makeAxisName({xy: 'x', idx: 0}),
        // nameMoveOverlap: true,
        nameLocation: app.config.xAxisNameLocation,
        axisLabel: {
            hideOverlap: app.config.hideOverlap,
            rotate: app.config.xAxisLabelRotate,
        },
        axisLine: {
            // show: true,
        },
        splitLine: {
            show: false,
        },
    }];
}

function makeYAxisOption() {
    return (new Array(app.config.yAxisCount)).fill(1).map((_, idx) => ({
        id: idx,
        name: makeAxisName({xy: 'y', idx}),
        alignTicks: true,
        type: app.config.yAxisType,
        nameLocation: app.config.yAxisNameLocation,
        axisLabel: {
            rotate: app.config.yAxisLabelRotate,
        },
        axisTick: {},
        axisLine: {
            show: true,
        },
    }));
}

function createOption() {
    return {
        // animation: false,
        title: {
            text: 'Grid outerBounds example',
            left: 5,
            top: 5,
        },
        legend: {
            top: 3,
        },
        graphic: {
            elements: makeIndicatorOption()
        },
        tooltip: {},
        xAxis: makeXAxisOption(),
        yAxis: makeYAxisOption(),
        grid: [{
            left: app.config['grid.left'],
            top: app.config['grid.top'],
            right: app.config['grid.right'],
            bottom: app.config['grid.bottom'],

            outerBounds: {
                left: app.config['grid.outerBounds.left'],
                top: app.config['grid.outerBounds.top'],
                right: app.config['grid.outerBounds.right'],
                bottom: app.config['grid.outerBounds.bottom']
            },

            outerBoundsMode: app.config.outerBoundsMode,
            containLabel: app.config.containLabel
        }],
        series: makeSeries()
    };
}

function chartSetOptionUpdate(chartIdx) {
    var option = createOption();
    myChart.setOption(
        option,
        {replaceMerge: ['series', 'xAxis', 'yAxis']}
    );
}
