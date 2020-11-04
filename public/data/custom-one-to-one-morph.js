/*
title: One-to-one Morphing
category: custom
titleCN: 一对一映射形变
difficulty: 11
*/

$.get(ROOT_PATH + '/data/asset/data/south-america-polygon.json', function (rawGeoPolygonMap) {

    var _geoWidth = myChart.getWidth();
    var _geoHeight = myChart.getHeight() * 0.8;
    var _animationDurationUpdate = 2000;
    var _data = [
        { name: "Argentina", value: 2652124 },
        { name: "Falkland Is.", value: 7697384 },
        { name: "Colombia", value: 3156196 },
        { name: "Paraguay", value: 8457736 },
        { name: "Peru", value: 1401646 },
        { name: "Bolivia", value: 5505577 },
        { name: "Brazil", value: 2217237 },
        { name: "Ecuador", value: 3398189 },
        { name: "Chile", value: 8008877 },
        { name: "Guyana", value: 4070041 },
        { name: "Uruguay", value: 478873 },
        { name: "Suriname", value: 2793265 },
        { name: "Venezuela", value: 2720478 }
    ];
    var _nameList = [];
    echarts.util.each(_data, function (item) {
        _nameList.push(item.name);
    });


    var geoPolygonMap = scalePolygons(rawGeoPolygonMap, _geoWidth, _geoHeight);

    var mapOption = {
        series: [{
            coordinateSystem: 'none',
            type: 'custom',
            data: _data,
            animationDurationUpdate: _animationDurationUpdate,
            renderItem: function (params, api) {
                var dataItem = _data[params.dataIndex];
                var points = geoPolygonMap[dataItem.name];
                return {
                    type: 'polygon',
                    morph: true,
                    shape: {
                        points: points
                    },
                    style: {
                        fill: '#aaa',
                        stroke: '#555',
                        strokeNoScale: true
                    }
                }
            }
        }]
    };

    var barOption = {
        xAxis: {
            data: _nameList,
            axisLabel: {
                interval: 0,
                rotate: 30
            }
        },
        yAxis: {
        },
        series: [{
            type: 'custom',
            data: _data,
            animationDurationUpdate: _animationDurationUpdate,
            renderItem: function (params, api) {
                var start = api.coord([params.dataIndex, 0]);
                var size = api.size([0, api.value(1)]);
                var width = 20;
                return {
                    type: 'rect',
                    morph: true,
                    shape: {
                        x: start[0] - width / 2,
                        y: start[1],
                        width: width,
                        height: -size[1]
                    },
                    style: {
                        fill: '#aaa',
                        stroke: '#555',
                        strokeNoScale: true
                    },
                };
            }
        }]
    };

    var bubbleOption = {
        xAxis: {
            data: _nameList,
            axisLabel: {
                interval: 0,
                rotate: 30
            }
        },
        yAxis: {
        },
        series: [{
            type: 'custom',
            data: _data,
            animationDurationUpdate: _animationDurationUpdate,
            renderItem: function (params, api) {
                var center = api.coord([params.dataIndex, api.value(1)]);
                return {
                    type: 'circle',
                    morph: true,
                    shape: {
                        cx: center[0],
                        cy: center[1],
                        r: api.value(1) / 5e5
                    },
                    style: {
                        fill: '#aaa',
                        stroke: '#555',
                        strokeNoScale: true
                    },
                };
            }

        }]
    };

    var angles = createPieAngles(_data);
    var pieOption = {
        series: [{
            type: 'custom',
            coordinateSystem: 'none',
            data: _data,
            animationDurationUpdate: 2000,
            renderItem(params, api) {
                var width = myChart.getWidth();
                var height = myChart.getHeight();
                return {
                    type: 'sector',
                    morph: true,
                    shape: {
                        cx: width / 2,
                        cy: height / 2,
                        r: Math.min(width, height) / 3,
                        r0: Math.min(width, height) / 5,
                        startAngle: angles[params.dataIndex][0],
                        endAngle: angles[params.dataIndex][1],
                        clockwise: true
                    },
                    style: {
                        fill: '#aaa',
                        stroke: '#555',
                        strokeNoScale: true
                    },
                };
            }
        }]
    };

    var options = [
        mapOption,
        barOption,
        bubbleOption,
        pieOption
    ];

    var currentIndex = 0;
    myChart.setOption(options[currentIndex]);

    function transitionToNext() {
        var nextIndex = (currentIndex + 1) % options.length;
        myChart.setOption(options[nextIndex], true);
        currentIndex = nextIndex;
    }

    setInterval(transitionToNext, 3000);

});



// --------
// Utils
// --------
function scalePolygons(rawGeoPolygonMap, width, height) {
    // Scale polygons for specified window size:
    var matrix = echarts.matrix.create();
    var geoPolygonMap = {};
    echarts.matrix.scale(matrix, matrix, [width, height]);
    echarts.util.each(rawGeoPolygonMap, function (polygon, name) {
        var scaledPolygon = [];
        for (var i = 0; i < polygon.length; i++) {
            var point = polygon[i].slice();
            echarts.vector.applyTransform(point, point, matrix);
            scaledPolygon.push(point);
        }
        geoPolygonMap[name] = scaledPolygon;
    });
    return geoPolygonMap;
}

function createPieAngles(data) {
    var pieData = data.slice();
    var totalValue = 0;
    echarts.util.each(pieData, function (item) {
        totalValue += item.value;
    });
    var angles = [];
    var currentAngle = -Math.PI / 2;
    for (var i = 0; i < pieData.length; i++) {
        var angle = pieData[i].value / totalValue * Math.PI * 2;
        angles.push([currentAngle, angle + currentAngle]);
        currentAngle += angle;
    }
    return angles;
}

