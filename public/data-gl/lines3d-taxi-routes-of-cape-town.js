mapboxgl.accessToken = mapboxglToken;

var ENCODE_SCALE = 1e6;
function decodeLine(line) {

    var result = [];
    var prevX = line[0];
    var prevY = line[1];

    for (var i = 0; i < line[2].length; i += 2) {
        var x = line[2].charCodeAt(i) - 64;
        var y = line[2].charCodeAt(i + 1) - 64;
        // ZigZag decoding
        x = (x >> 1) ^ (-(x & 1));
        y = (y >> 1) ^ (-(y & 1));
        // Delta deocding
        x += prevX;
        y += prevY;

        prevX = x;
        prevY = y;
        // Dequantize
        result.push([x / ENCODE_SCALE, y / ENCODE_SCALE, 10]);
    }

    return result;
}

var geoJSON = {
    features: []
};
var regions = [];
var readShp = new Promise(function (resolve, reject) {
    shapefile.open(ROOT_PATH + '/asset/get/s/data-1498751177695-rkzAeiGEb.shp', ROOT_PATH + '/asset/get/s/data-1498751184605-rJYAxjMVW.dbf')
        .then(source => source.read()
            .then(function append(result) {
                if (result.done) {
                    resolve();
                    return;
                }
                var feature = result.value;
                feature.properties.name = geoJSON.features.length + '';
                regions.push({
                    name: geoJSON.features.length + '',
                    value: 1,
                    height: feature.properties.SHAPE_leng * 10000
                })
                geoJSON.features.push(feature);
                return source.read().then(append);
            })
        );
});

myChart.showLoading();

Promise.all([$.getJSON(ROOT_PATH + '/asset/get/s/data-1498751206824-HkkgZsfEW.json'), readShp])
    .then(function ([data, lastFeature]) {

        var lines = data.map(function (track) {
            return {
                coords: decodeLine(track)
            };
        });

        myChart.hideLoading();

        echarts.registerMap('buildings', geoJSON);

        myChart.setOption({
            mapbox: {
                center: [18.424552361777955, -33.92188144682616],
                zoom: 14,
                pitch: 50,
                bearing: -10,
                altitudeScale: 2,
                style: 'mapbox://styles/mapbox/dark-v9',
                postEffect: {
                    enable: true,
                    screenSpaceAmbientOcclusion: {
                        enable: true,
                        intensity: 1.2,
                        radius: 6,
                        quality: 'high'
                    },
                    screenSpaceReflection: {
                        enable: true
                    }
                },
                light: {
                    main: {
                        intensity: 1,
                        shadow: true,
                        shadowQuality: 'high'
                    },
                    ambient: {
                        intensity: 0.
                    },
                    ambientCubemap: {
                        texture: ROOT_PATH + '/data-gl/asset/pisa.hdr',
                        exposure: 1,
                        diffuseIntensity: 0.5,
                        specularIntensity: 2
                    }
                }
            },
            series: [{
                type: 'lines3D',

                coordinateSystem: 'mapbox',

                effect: {
                    show: true,
                    constantSpeed: 5,
                    trailWidth: 2,
                    trailLength: 0.8,
                    trailOpacity: 1,
                    spotIntensity: 10
                },

                blendMode: 'lighter',

                polyline: true,

                lineStyle: {
                    width: 0.1,
                    color: 'rgb(200, 40, 0)',
                    opacity: 0.
                },

                data: {
                    count: function () {
                        return lines.length;
                    },
                    getItem: function (idx) {
                        return lines[idx]
                    }
                }
            }, {
                type: 'map3D',
                map: 'buildings',

                coordinateSystem: 'mapbox',
                shading: 'realistic',
                silent: true,

                instancing: true,

                data: regions,

                realisticMaterial: {
                    metalness: 1,
                    roughness: 0.2,
                }
            }]
        });
    });

window.addEventListener('keydown', function () {
    myChart.dispatchAction({
        type: 'lines3DToggleEffect',
        seriesIndex: 0
    });
});