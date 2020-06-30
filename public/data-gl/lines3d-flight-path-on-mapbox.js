// 数据来自 https://uber.github.io/deck.gl/#/examples/core-layers/line-layer

mapboxgl.accessToken = 'pk.eyJ1IjoicGlzc2FuZyIsImEiOiJjaXBnaGYxcW8wMDFodWNtNDc4NzdqMWR2In0.4XUWeduDltiCbsIiS-U8Lg';


$.get(ROOT_PATH + '/asset/get/s/data-1497886591658-rJOKkdH7W.txt', function (text) {

    var data = decodeFlightPathData(text);

    var dataAll = [];
    for (var i = 0; i < 4; i++) {
        dataAll = dataAll.concat(data.map(function (item) {
            return {
                name: item.name,
                coords: item.coords.map(function (coord) {
                    return coord.slice();
                })
            };
        }));
    }

    myChart.setOption({
        mapbox: {
            center: [0, 51.5],
            zoom: 8,
            pitch: 60,
            altitudeScale: 5,
            style: 'mapbox://styles/mapbox/dark-v9',
            postEffect: {
                enable: true,
                bloom: {
                    intensity: 0.4
                }
            }
        },
        series: [{
            type: 'lines3D',

            coordinateSystem: 'mapbox',

            effect: {
                show: true,
                constantSpeed: 40,
                trailWidth: 2,
                trailLength: 0.15,
                trailOpacity: 1
            },

            blendMode: 'lighter',

            polyline: true,

            lineStyle: {
                width: 1,
                color: 'rgb(50, 60, 170)',
                opacity: 0.1
            },

            data: dataAll
        }]
    });

    window.addEventListener('keydown', function () {
        myChart.dispatchAction({
            type: 'lines3DToggleEffect',
            seriesIndex: 0
        });
    });
});


/**
 * https://github.com/mapbox/polyline
 *
 * Decodes to a [longitude, latitude] coordinates array.
 *
 * This is adapted from the implementation in Project-OSRM.
 *
 * @param {String} str
 * @param {Number} precision
 * @returns {Array}
 *
 * @see https://github.com/Project-OSRM/osrm-frontend/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
 */
function decodePolyline(str, precision) {
    var index = 0;
    var lat = 0;
    var lng = 0;
    var coordinates = [];
    var shift = 0;
    var result = 0;
    var byte = null;
    var latitude_change;
    var longitude_change;
    var factor = Math.pow(10, precision || 5);

        // Coordinates have variable length when encoded, so just keep
        // track of whether we've hit the end of the string. In each
        // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lng / factor, lat / factor]);
    }

    return coordinates;
}

function decodeFlightPathData(text) {
    var lines = text.split('\n');

    var result = [];

    lines.forEach(function(line) {

        if (!line) {
            return;
        }

        var parts = line.split('\t');
        var coords0 = parts[2].split('\x01').map(function(str) { return decodePolyline(str, 5) });
        var coords1 = parts[3].split('\x01').map(function(str) { return decodePolyline(str, 1) });

        var coords = [];
        coords0.forEach(function(lineStr, i) {
            for (var j = 1; j < lineStr.length; j++) {
                var prevPt0 = coords0[i][j - 1],
                    prevPt1 = coords1[i][j - 1],
                    currPt0 = coords0[i][j],
                    currPt1 = coords1[i][j];

                coords.push(
                    [prevPt0[0], prevPt0[1], prevPt1[0]],
                    [currPt0[0], currPt0[1], currPt1[0]]
                );
            // result.push({
            //     name: parts[0],
            //     country: parts[1],
            //     start: [prevPt0[0], prevPt0[1], prevPt1[0]],
            //     end: [currPt0[0], currPt0[1], currPt1[0]]
            // });
            }
        });

        result.push({
            name: parts[0],
            country: parts[1],
            coords: coords
        });
    });
    return result;
}