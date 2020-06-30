var HEIGHT_RATIO = 0.6;
var DIM_CATEGORY_INDEX = 0;
var DIM_TIME_ARRIVAL = 1;
var DIM_TIME_DEPARTURE = 2;
var DATA_ZOOM_AUTO_MOVE_THROTTLE = 30;
var DATA_ZOOM_X_INSIDE_INDEX = 1;
var DATA_ZOOM_Y_INSIDE_INDEX = 3;
var DATA_ZOOM_AUTO_MOVE_SPEED = 0.2;
var DATA_ZOOM_AUTO_MOVE_DETECT_AREA_WIDTH = 30;

var _draggable;
var _draggingEl;
var _dropShadow;
var _draggingCursorOffset = [0, 0];
var _draggingTimeLength;
var _draggingRecord;
var _dropRecord;
var _cartesianXBounds = [];
var _cartesianYBounds = [];
var _rawData;
var _autoDataZoomAnimator;

$.get(ROOT_PATH + '/data/asset/data/airport-schedule.json', function (rawData) {
    _rawData = rawData;
    myChart.setOption(option = makeOption());
    initDrag();
});

function makeOption() {
    return {
        tooltip: {
        },
        animation: false,
        toolbox: {
            left: 20,
            top: 0,
            itemSize: 20,
            feature: {
                myDrag: {
                    show: true,
                    title: 'Make bars\ndraggable',
                    icon: 'path://M990.55 380.08 q11.69 0 19.88 8.19 q7.02 7.01 7.02 18.71 l0 480.65 q-1.17 43.27 -29.83 71.93 q-28.65 28.65 -71.92 29.82 l-813.96 0 q-43.27 -1.17 -72.5 -30.41 q-28.07 -28.07 -29.24 -71.34 l0 -785.89 q1.17 -43.27 29.24 -72.5 q29.23 -29.24 72.5 -29.24 l522.76 0 q11.7 0 18.71 7.02 q8.19 8.18 8.19 18.71 q0 11.69 -7.6 19.29 q-7.6 7.61 -19.3 7.61 l-518.08 0 q-22.22 1.17 -37.42 16.37 q-15.2 15.2 -15.2 37.42 l0 775.37 q0 23.39 15.2 38.59 q15.2 15.2 37.42 15.2 l804.6 0 q22.22 0 37.43 -15.2 q15.2 -15.2 16.37 -38.59 l0 -474.81 q0 -11.7 7.02 -18.71 q8.18 -8.19 18.71 -8.19 l0 0 ZM493.52 723.91 l-170.74 -170.75 l509.89 -509.89 q23.39 -23.39 56.13 -21.05 q32.75 1.17 59.65 26.9 l47.94 47.95 q25.73 26.89 27.49 59.64 q1.75 32.75 -21.64 57.3 l-508.72 509.9 l0 0 ZM870.09 80.69 l-56.13 56.14 l94.72 95.9 l56.14 -57.31 q8.19 -9.35 8.19 -21.05 q-1.17 -12.86 -10.53 -22.22 l-47.95 -49.12 q-10.52 -9.35 -23.39 -9.35 q-11.69 -1.17 -21.05 7.01 l0 0 ZM867.75 272.49 l-93.56 -95.9 l-380.08 380.08 l94.73 94.73 l378.91 -378.91 l0 0 ZM322.78 553.16 l38.59 39.77 l-33.92 125.13 l125.14 -33.92 l38.59 38.6 l-191.79 52.62 q-5.85 1.17 -12.28 0 q-6.44 -1.17 -11.11 -5.84 q-4.68 -4.68 -5.85 -11.7 q-2.34 -5.85 0 -11.69 l52.63 -192.97 l0 0 Z',
                    onclick: onDragSwitchClick
                }
            }
        },
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
            start: 0,
            end: 26,
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            showDetail: false
        }, {
            type: 'inside',
            id: 'insideX',
            xAxisIndex: 0,
            filterMode: 'weakFilter',
            start: 0,
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
            id: 'insideY',
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
            max: _rawData.parkingApron.data.length
        },
        series: [{
            id: 'flightData',
            type: 'custom',
            renderItem: renderGanttItem,
            dimensions: _rawData.flight.dimensions,
            encode: {
                x: [DIM_TIME_ARRIVAL, DIM_TIME_DEPARTURE],
                y: DIM_CATEGORY_INDEX,
                tooltip: [DIM_CATEGORY_INDEX, DIM_TIME_ARRIVAL, DIM_TIME_DEPARTURE]
            },
            data: _rawData.flight.data
        }, {
            type: 'custom',
            renderItem: renderAxisLabelItem,
            dimensions: _rawData.parkingApron.dimensions,
            encode: {
                x: -1, // Then this series will not controlled by x.
                y: 0
            },
            data: echarts.util.map(_rawData.parkingApron.data, function (item, index) {
                return [index].concat(item);
            })
        }]
    };
}

function renderGanttItem(params, api) {
    var categoryIndex = api.value(DIM_CATEGORY_INDEX);
    var timeArrival = api.coord([api.value(DIM_TIME_ARRIVAL), categoryIndex]);
    var timeDeparture = api.coord([api.value(DIM_TIME_DEPARTURE), categoryIndex]);

    var coordSys = params.coordSys;
    _cartesianXBounds[0] = coordSys.x;
    _cartesianXBounds[1] = coordSys.x + coordSys.width;
    _cartesianYBounds[0] = coordSys.y;
    _cartesianYBounds[1] = coordSys.y + coordSys.height;

    var barLength = timeDeparture[0] - timeArrival[0];
    // Get the heigth corresponds to length 1 on y axis.
    var barHeight = api.size([0, 1])[1] * HEIGHT_RATIO;
    var x = timeArrival[0];
    var y = timeArrival[1] - barHeight;

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

// -------------
//  Enable Drag
// -------------

function onDragSwitchClick(model, api, type) {
    _draggable = !_draggable;
    myChart.setOption({
        dataZoom: [{
            id: 'insideX',
            disabled: _draggable
        }, {
            id: 'insideY',
            disabled: _draggable
        }]
    });
    this.model.setIconStatus(type, _draggable ? 'emphasis' : 'normal');
}

function initDrag() {

    _autoDataZoomAnimator = makeAnimator(dispatchDataZoom);

    myChart.on('mousedown', function (param) {
        if (!_draggable || !param || param.seriesIndex == null) {
            return;
        }

        // Drag start
        _draggingRecord = {
            dataIndex: param.dataIndex,
            categoryIndex: param.value[DIM_CATEGORY_INDEX],
            timeArrival: param.value[DIM_TIME_ARRIVAL],
            timeDeparture: param.value[DIM_TIME_DEPARTURE]
        };
        var style = {lineWidth: 2, fill: 'rgba(255,0,0,0.1)', stroke: 'rgba(255,0,0,0.8)', lineDash: [6, 3]};

        _draggingEl = addOrUpdateBar(_draggingEl, _draggingRecord, style, 100);
        _draggingCursorOffset = [
            _draggingEl.position[0] - param.event.offsetX,
            _draggingEl.position[1] - param.event.offsetY
        ];
        _draggingTimeLength = _draggingRecord.timeDeparture - _draggingRecord.timeArrival;
    });

    myChart.getZr().on('mousemove', function (event) {
        if (!_draggingEl) {
            return;
        }

        var cursorX = event.offsetX;
        var cursorY = event.offsetY;

        // Move _draggingEl.
        _draggingEl.attr('position', [
            _draggingCursorOffset[0] + cursorX,
            _draggingCursorOffset[1] + cursorY,
        ]);

        prepareDrop();

        autoDataZoomWhenDraggingOutside(cursorX, cursorY);
    });

    myChart.getZr().on('mouseup', function () {
        // Drop
        if (_draggingEl && _dropRecord) {

            updateRawData() && myChart.setOption({
                series: {
                    id: 'flightData',
                    data: _rawData.flight.data
                }
            });
        }
        dragRelease();
    });
    myChart.getZr().on('globalout', dragRelease);

    function dragRelease() {
        _autoDataZoomAnimator.stop();

        if (_draggingEl) {
            myChart.getZr().remove(_draggingEl);
            _draggingEl = null;
        }
        if (_dropShadow) {
            myChart.getZr().remove(_dropShadow);
            _dropShadow = null;
        }
        _dropRecord = _draggingRecord = null;
    }

    function addOrUpdateBar(el, itemData, style, z) {
        var pointArrival = myChart.convertToPixel('grid', [itemData.timeArrival, itemData.categoryIndex]);
        var pointDeparture = myChart.convertToPixel('grid', [itemData.timeDeparture, itemData.categoryIndex]);

        var barLength = pointDeparture[0] - pointArrival[0];
        var barHeight = Math.abs(
            myChart.convertToPixel('grid', [0, 0])[1] - myChart.convertToPixel('grid', [0, 1])[1]
        ) * HEIGHT_RATIO;

        if (!el) {
            el = new echarts.graphic.Rect({
                shape: {x: 0, y: 0, width: 0, height: 0},
                style: style,
                z: z
            });
            myChart.getZr().add(el);
        }
        el.attr({
            shape: {x: 0, y: 0, width: barLength, height: barHeight},
            position: [pointArrival[0], pointArrival[1] - barHeight]
        });
        return el;
    }

    function prepareDrop() {
        // Check droppable place.
        var xPixel = _draggingEl.shape.x + _draggingEl.position[0];
        var yPixel = _draggingEl.shape.y + _draggingEl.position[1];
        var cursorData = myChart.convertFromPixel('grid', [xPixel, yPixel]);
        if (cursorData) {
            // Make drop shadow and _dropRecord
            _dropRecord = {
                categoryIndex: Math.floor(cursorData[1]),
                timeArrival: cursorData[0],
                timeDeparture: cursorData[0] + _draggingTimeLength
            };
            var style = {fill: 'rgba(0,0,0,0.4)'};
            _dropShadow = addOrUpdateBar(_dropShadow, _dropRecord, style, 99);
        }
    }

    // This is some business logic, don't care about it.
    function updateRawData() {
        var flightData = _rawData.flight.data;
        var movingItem = flightData[_draggingRecord.dataIndex];

        // Check conflict
        for (var i = 0; i < flightData.length; i++) {
            var dataItem = flightData[i];
            if (dataItem !== movingItem
                && _dropRecord.categoryIndex === dataItem[DIM_CATEGORY_INDEX]
                && _dropRecord.timeArrival < dataItem[DIM_TIME_DEPARTURE]
                && _dropRecord.timeDeparture > dataItem[DIM_TIME_ARRIVAL]
            ) {
                alert('Conflict! Find a free space to settle the bar!');
                return;
            }
        }

        // No conflict.
        movingItem[DIM_CATEGORY_INDEX] = _dropRecord.categoryIndex;
        movingItem[DIM_TIME_ARRIVAL] = _dropRecord.timeArrival;
        movingItem[DIM_TIME_DEPARTURE] = _dropRecord.timeDeparture;
        return true;
    }

    function autoDataZoomWhenDraggingOutside(cursorX, cursorY) {
        // When cursor is outside the cartesian and being dragging,
        // auto move the dataZooms.
        var cursorDistX = getCursorCartesianDist(cursorX, _cartesianXBounds);
        var cursorDistY = getCursorCartesianDist(cursorY, _cartesianYBounds);

        if (cursorDistX !== 0 || cursorDistY !== 0) {
            _autoDataZoomAnimator.start({
                cursorDistX: cursorDistX,
                cursorDistY: cursorDistY
            });
        }
        else {
            _autoDataZoomAnimator.stop();
        }
    }

    function dispatchDataZoom(params) {
        var option = myChart.getOption();
        var optionInsideX = option.dataZoom[DATA_ZOOM_X_INSIDE_INDEX];
        var optionInsideY = option.dataZoom[DATA_ZOOM_Y_INSIDE_INDEX];
        var batch = [];

        prepareBatch(batch, 'insideX', optionInsideX.start, optionInsideX.end, params.cursorDistX);
        prepareBatch(batch, 'insideY', optionInsideY.start, optionInsideY.end, -params.cursorDistY);

        batch.length && myChart.dispatchAction({
            type: 'dataZoom',
            batch: batch
        });

        function prepareBatch(batch, id, start, end, cursorDist) {
            if (cursorDist === 0) {
                return;
            }
            var sign = cursorDist / Math.abs(cursorDist);
            var size = end - start;
            var delta = DATA_ZOOM_AUTO_MOVE_SPEED * sign;

            start += delta;
            end += delta;

            if (end > 100) {
                end = 100;
                start = end - size;
            }
            if (start < 0) {
                start = 0;
                end = start + size;
            }
            batch.push({
                dataZoomId: id,
                start: start,
                end: end
            });
        }
    }

    function getCursorCartesianDist(cursorXY, bounds) {
        var dist0 = cursorXY - (bounds[0] + DATA_ZOOM_AUTO_MOVE_DETECT_AREA_WIDTH);
        var dist1 = cursorXY - (bounds[1] - DATA_ZOOM_AUTO_MOVE_DETECT_AREA_WIDTH);
        return dist0 * dist1 <= 0
            ? 0 // cursor is in cartesian
            : dist0 < 0
            ? dist0 // cursor is at left/top of cartesian
            : dist1; // cursor is at right/bottom of cartesian
    }

    function makeAnimator(callback) {
        var requestId;
        var callbackParams;
        // Use throttle to prevent from calling dispatchAction frequently.
        callback = echarts.throttle(callback, DATA_ZOOM_AUTO_MOVE_THROTTLE);

        function onFrame() {
            callback(callbackParams);
            requestId = requestAnimationFrame(onFrame);
        }

        return {
            start: function (params) {
                callbackParams = params;
                if (requestId == null) {
                    onFrame();
                }
            },
            stop: function () {
                if (requestId != null) {
                    cancelAnimationFrame(requestId);
                }
                requestId = callbackParams = null;
            }
        };
    }
}
