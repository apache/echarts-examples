option = {
    globe: {
        displacementTexture: '/asset/get/s/data-1491837512042-rJlLfXYax.jpg',

        displacementScale: 0.1,
        displacementQuality: 'ultra',

        shading: 'realistic',
        realisticMaterial: {
            roughness: 0.8,
            metalness: 0
        },

        postEffect: {
            enable: true,
            SSAO: {
                enable: true,
                radius: 2,
                intensity: 1.5,
                quality: 'high'
            }
        },
        temporalSuperSampling: {
            enable: true
        },
        light: {
            ambient: {
                intensity: 0
            },
            main: {
                intensity: 1,
                shadow: true
            },
            ambientCubemap: {
                texture: '/asset/get/s/data-1491838644249-ry33I7YTe.hdr',
                exposure: 1,
                diffuseIntensity: 0.2
            }
        },
        viewControl: {
            autoRotate: false
        },
        debug: {
            wireframe: {
                show: true
            }
        }
    },
    series: []
};