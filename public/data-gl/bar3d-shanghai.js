var uploadedDataURL = ROOT_PATH + '/asset/get/s/data-1495284690309-Bk9Ro3Te-.json';
mapboxgl.accessToken = mapboxglToken;

myChart.showLoading();

$.getJSON(uploadedDataURL, function(linedata) {

    myChart.hideLoading();

    myChart.setOption({

        visualMap: {
            show: false,
            calculable: true,
            realtime: false,
            inRange: {
                color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            },
            outOfRange: {
                colorAlpha: 0
            },
            max: linedata[1]
        },
        mapbox: {
            center: [121.4693, 31.123070],
            zoom: 10,
            pitch: 50,
            bearing: -10,
            style: 'mapbox://styles/mapbox/light-v9',
            boxHeight: 50,
            // altitudeScale: 3e2,
            postEffect: {
                enable: true,
                SSAO: {
                    enable: true,
                    radius: 2,
                    intensity: 1.5
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
                    texture: ROOT_PATH + '/data-gl/asset/canyon.hdr',
                    exposure: 1,
                    diffuseIntensity: 0.5
                }
            }
        },
        series: [{
            type: 'bar3D',
            shading: 'realistic',
            coordinateSystem: 'mapbox',
            barSize: 0.2,
            silent: true,
            data: linedata[0]
        }]
    });
});