
option = {
    backgroundColor: '#000',
    globe: {
        baseTexture: "/asset/get/s/data-1491837049070-rJZtl7Y6x.jpg",
        heightTexture: "/asset/get/s/data-1491837512042-rJlLfXYax.jpg",
        displacementScale: 0.2,
        shading: 'realistic',
        environment: '/asset/get/s/data-1491837999815-H1_44Qtal.jpg',
        realisticMaterial: {
            roughness: '/asset/get/s/data-1497599804873-H1SHkG-mZ.jpg',
            metalness: '/asset/get/s/data-1497599800643-BJbHyGWQW.jpg',
            textureTiling: [8, 4]
        },
        postEffect: {
            enable: true
        },
        viewControl: {
            autoRotate: false  
        },
        light: {
            main: {
                intensity: 2,
                shadow: true
            },
            ambientCubemap: {
                texture: '/asset/get/s/data-1491838644249-ry33I7YTe.hdr',
                exposure: 2,
                diffuseIntensity: 2,
                specularIntensity: 2
            }
        }
    }
};