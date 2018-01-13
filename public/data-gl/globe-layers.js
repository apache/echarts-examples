option = {
    backgroundColor: '#000',
    globe: {
        baseTexture: 'data-gl/asset/earth.jpg',
        heightTexture: 'data-gl/asset/bathymetry_bw_composite_4k.jpg',

        displacementScale: 0.1,

        shading: 'lambert',

        environment: 'data-gl/asset/starfield.jpg',

        light: {
            ambient: {
                intensity: 0.1
            },
            main: {
                intensity: 1.5
            }
        },

        layers: [{
            type: 'blend',
            blendTo: 'emission',
            texture: 'data-gl/asset/night.jpg'
        }, {
            type: 'overlay',
            texture: 'data-gl/asset/clouds.png',
            shading: 'lambert',
            distance: 5
        }]
    },
    series: []
}