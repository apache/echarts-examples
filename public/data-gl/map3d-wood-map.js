$.getJSON(ROOT_PATH + '/data-gl/asset/data/alcohol.json', function (data) {
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
                roughness: ROOT_PATH + "/data-gl/asset/wood/roughness.jpg",
                normalTexture: ROOT_PATH + "/data-gl/asset/wood/normal.jpg",
                detailTexture: ROOT_PATH + "/data-gl/asset/wood/diffuse.jpg",
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
                    texture: ROOT_PATH + '/data-gl/asset/canyon.hdr'
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
                    roughness: ROOT_PATH + "/data-gl/asset/redbricks/roughness.jpg",
                    normalTexture: ROOT_PATH + "/data-gl/asset/redbricks/normal.jpg",
                    detailTexture: ROOT_PATH + "/data-gl/asset/redbricks/diffuse.jpg",
                    textureTiling: [8, 4]
                }
            },
            data: regionData
        }]
    };

    myChart.setOption(option);
});