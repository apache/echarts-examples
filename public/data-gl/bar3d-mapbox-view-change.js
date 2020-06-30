mapboxgl.accessToken = mapboxglToken;


$.getJSON(ROOT_PATH + '/data-gl/asset/data/population.json', function (data) {

    data = data.filter(function (dataItem) {
        return dataItem[2] > 0;
    }).map(function (dataItem) {
        return [dataItem[0], dataItem[1], dataItem[2]];
    });

    myChart.setOption({
        title: {
            text: '空格键切换视角',
            left: 'center'
        },
        visualMap: {
            show: false,
            max: 1000,
            calculable: true,
            realtime: false,
            inRange: {
                color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            },
            outOfRange: {
                colorAlpha: 0
            }
        },
        mapbox: {
            center: [104.114129, 37.550339],
            zoom: 3,
            pitch: 50,
            bearing: -10,
            style: 'mapbox://styles/mapbox/light-v9',
            boxHeight: 20,
            // altitudeScale: 3e2,
            postEffect: {
                enable: true,
                SSAO: {
                    enable: true,
                    radius: 2
                }
            },
            light: {
                main: {
                    intensity: 2,
                    shadow: true,
                    shadowQuality: 'high'
                },
                ambient: {
                    intensity: 0.
                },
                ambientCubemap: {
                    texture: ROOT_PATH + '/data-gl/asset/canyon.hdr',
                    exposure: 2,
                    diffuseIntensity: 0.5
                }
            }
        },
        series: [{
            type: 'bar3D',
            coordinateSystem: 'mapbox',
            shading: 'lambert',
            minHeight: 0.1,
            barSize: 0.3,
            data: data,
            silent: true
        }]
    });

    function top() {
        myChart.setOption({
            mapbox: {
                pitch: 0,
                bearing: 0,
                boxHeight: 0
            }
        });
    }

    function perspective() {
        myChart.setOption({
            mapbox: {
                pitch: 50,
                bearing: -10,
                boxHeight: 20,
            }
        });
    }

    var isPerspective = true;
    window.addEventListener('keydown', function (e) {
        if (e.keyCode === 32) {
            isPerspective ? top() : perspective();
            isPerspective = !isPerspective;
        }
    })
});