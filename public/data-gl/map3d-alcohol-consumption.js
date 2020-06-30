$.getJSON(ROOT_PATH + '/data-gl/asset/data/alcohol.json', function (data) {
    var regionData = data.map(function (item) {
        return {
            name: item[0],
            value: item[1]
        }
    })
    console.log(regionData);

    myChart.setOption({
        backgroundColor: '#cdcfd5',
        visualMap: {
            min: 0,
            max: 15,
            realtime: true,
            calculable : true,
            inRange: {
                color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            }
        },
        series: [{
            type: 'map3D',
            map: 'world',
            shading: 'lambert',
            realisticMaterial: {
                roughness: 0.2,
                metalness: 0
            },
            postEffect: {
                enable: true,
                SSAO: {
                    enable: true,
                    radius: 2,
                    intensity: 1
                }
            },
            groundPlane: {
                show: true
            },
            light: {
                main: {
                    intensity: 2,
                    shadow: true,
                    shadowQuality: 'high',
                    alpha: 30
                },
                ambient: {
                    intensity: 0
                },
                ambientCubemap: {
                    texture: ROOT_PATH + '/data-gl/asset/canyon.hdr',
                    exposure: 1,
                    diffuseIntensity: 1
                }
            },
            viewControl: {
                distance: 50
            },


            regionHeight: 1,

            data: regionData
        }]
    });
})