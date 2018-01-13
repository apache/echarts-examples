option = {
    globe: {
        baseTexture: 'data-gl/asset/moon-base.jpg',
        heightTexture: 'data-gl/asset/moon-bump.jpg',

        displacementScale: 0.05,
        displacementQuality: 'medium',

        environment: 'data-gl/asset/starfield.jpg',

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
                intensity: 1,
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
                intensity: 2,
                shadow: true
            },
            ambientCubemap: {
                texture: 'data-gl/asset/pisa.hdr',
                exposure: 0,
                diffuseIntensity: 0.02
            }
        },
        viewControl: {
            autoRotate: false
        }
    },
    series: []
};