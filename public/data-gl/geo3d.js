option = {
    geo3D: {
        map: 'world',
        lambertMaterial: {
            baseTexture: 'data-gl/asset/woods.jpg',
            textureTiling: 10
        },

        postEffect: {
            enable: true,
            SSAO: {
                enable: true,
                radius: 1
            }
        },
        groundPlane: {
            show: true
        },
        light: {
            main: {
                intensity: 1,
                shadow: true
            },
            ambientCubemap: {
                texture: 'data-gl/asset/canyon.hdr'
            }
        },
        viewControl: {
            distance: 50
        },

        itemStyle: {
            borderColor: '#000',
            borderWidth: 0.5
        },


        boxHeight: 1.0
    }
}

myChart.on('click', function () {
    alert('click')
});