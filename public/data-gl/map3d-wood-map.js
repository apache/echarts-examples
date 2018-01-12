$.getJSON('/asset/get/s/data-1491899618649-rysySf5ae.json', function (data) {
    var regionData = data.map(function (item) {
        return {
            name: item[0],
            height: Math.pow(item[1], 0.2) + 1
        }
    })
    option = {
        series: [{
            type: 'map3D',
            map: 'world',
            shading: 'realistic',
            realisticMaterial: {
                roughness: "/asset/get/s/data-1497191796671-B16_H05G-.png",
                normalTexture: "/asset/get/s/data-1497191771850-rJ4DrAqf-.jpg",
                detailTexture: "/asset/get/s/data-1497191756633-SJr8HRqzW.jpg",
                textureTiling: [2, 2]
            },
            postEffect: {
                enable: true,
                SSAO: {
                    enable: true,
                    radius: 3,
                    intensity: 1.4,
                    quality: 'high'
                }
            },
            light: {
                main: {
                    intensity: 2,
                    shadow: true,
                    shadowQuality: 'high',
                    alpha: 150,
                    beta: 0
                },
                ambient: {
                    intensity: 0
                },
                ambientCubemap: {
                    diffuseIntensity: 2,
                    specularIntensity: 2,
                    texture: '/asset/get/s/data-1491896094618-H1DmP-5px.hdr'
                }
            },
            viewControl: {
                alpha: 89,
                rotateMouseButton: 'right',
                panMouseButton: 'left',
                distance: 80
            },
            groundPlane: {
                show: true,
                color: '#333',
                realisticMaterial: {
                    detailTexture: '/asset/get/s/data-1497885046658-By1KKPBmb.jpg',
                    normalTexture: '/asset/get/s/data-1497885051551-ry4YtwHmZ.jpg',
                    roughness: '/asset/get/s/data-1497885057651-Sy9KKvSQb.jpg',
                    textureTiling: [8, 4]
                }
            },
            data: regionData
        }]
    };
    
    myChart.setOption(option);
});