option = {
    globe: {
        baseTexture: '/asset/get/s/data-1493804606544-r1PBU7D1W.jpg',
        heightTexture: '/asset/get/s/data-1493804610896-SJoBIXPkW.jpg',

        displacementScale: 0.05,
        displacementQuality: 'medium',
        
        environment: '/asset/get/s/data-1491837999815-H1_44Qtal.jpg',

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
                texture: '/asset/get/s/data-1491838644249-ry33I7YTe.hdr',
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