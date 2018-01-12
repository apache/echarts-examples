option = {
    backgroundColor: '#000',
    globe: {
        baseTexture: '/asset/get/s/data-1491890179041-Hkj-elqpe.jpg',
        heightTexture: '/asset/get/s/data-1491889019097-rJQYikcpl.jpg',

        displacementScale: 0.1,

        shading: 'lambert',
        
        environment: '/asset/get/s/data-1491837999815-H1_44Qtal.jpg',
        
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
            texture: '/asset/get/s/data-1491890291849-rJ2uee5ag.jpg'
        }, {
            type: 'overlay',
            texture: '/asset/get/s/data-1491890092270-BJEhJg96l.png',
            shading: 'lambert',
            distance: 5
        }]
    },
    series: []
}