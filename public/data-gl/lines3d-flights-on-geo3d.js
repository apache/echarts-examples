$.getJSON(ROOT_PATH + '/data-gl/asset/data/flights.json', function(data) {
    function getAirportCoord(idx) {
        return [data.airports[idx][3], data.airports[idx][4]];
    }
    var routes = data.routes.map(function(airline) {
        return [
            getAirportCoord(airline[1]),
            getAirportCoord(airline[2])
        ];
    });

    myChart.setOption({
        geo3D: {
            map: 'world',
            shading: 'color',

            environment: ROOT_PATH + '/data-gl/asset/starfield.jpg',

            silent: true,

            groundPlane: {
                show: false
            },
            light: {
                main: {
                    intensity: 0
                },
                ambient: {
                    intensity: 0
                }
            },
            viewControl: {
                distance: 50
            },

            itemStyle: {
                areaColor: '#111'
            },

            boxHeight: 0.5
        },
        series: [{
            type: 'lines3D',

            coordinateSystem: 'geo3D',

            effect: {
                show: true,
                trailWidth: 2,
                trailLength: 0.2
            },

            blendMode: 'lighter',

            lineStyle: {
                width: 0,
                color: 'rgb(50, 50, 150)',
                opacity: 0.2
            },

            data: routes
        }]
    });
});

window.addEventListener('keydown', function () {
    myChart.dispatchAction({
        type: 'lines3DToggleEffect',
        seriesIndex: 0
    });
});