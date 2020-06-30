$.getJSON(ROOT_PATH + "/data-gl/asset/data/population.json", function (data) {

    data = data.filter(function (dataItem) {
        return dataItem[2] > 0;
    }).map(function (dataItem) {
        return [dataItem[0], dataItem[1], Math.sqrt(dataItem[2])];
    });

    option = {
        backgroundColor: '#000',
        globe: {
            baseTexture: ROOT_PATH + "/data-gl/asset/world.topo.bathy.200401.jpg",
            heightTexture: ROOT_PATH + "/data-gl/asset/world.topo.bathy.200401.jpg",
            shading: 'lambert',
            environment: ROOT_PATH + '/data-gl/asset/starfield.jpg',
            light: {
                main: {
                    intensity: 2
                }
            },
            viewControl: {
                autoRotate: false
            }
        },
        visualMap: {
            max: 40,
            calculable: true,
            realtime: false,
            inRange: {
                colorLightness: [0.2, 0.9]
            },
            textStyle: {
                color: '#fff'
            },
            controller: {
                inRange: {
                    color: 'orange'
                }
            },
            outOfRange: {
                colorAlpha: 0
            }
        },
        series: [{
            type: 'bar3D',
            coordinateSystem: 'globe',
            data: data,
            barSize: 0.6,
            minHeight: 0.2,
            silent: true,
            itemStyle: {
                color: 'orange'
            }
        }]
    };

    myChart.setOption(option);
})