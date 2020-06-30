option = {
    tooltip: {},
    visualMap: {
        show: false,
        dimension: 2,
        min: -5,
        max: 0,
        inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
    },
    xAxis3D: {},
    yAxis3D: {},
    zAxis3D: {},
    grid3D: {
        show: true,
        postEffect: {
            enable: true
        },
        temporalSuperSampling: {
            enable: true
        },
        light: {
            main: {
                intensity: 3,
                shadow: true
            },
            ambient: {
                intensity: 0
            },
            ambientCubemap: {
                texture: ROOT_PATH + '/data-gl/asset/canyon.hdr',
                exposure: 2,
                diffuseIntensity: 1,
                specularIntensity: 1
            }
        }
    },
    series: [{
        type: 'surface',
        parametric: true,
        wireframe: {
            show: false
        },
        shading: 'realistic',
        realisticMaterial: {
            roughness: 0.4,
            metalness: 0
        },
        parametricEquation: {
            u: {
                min: -Math.PI,
                max: Math.PI,
                step: Math.PI / 40
            },
            v: {
                min: -15,
                max: 6,
                step: 0.21
            },
            x: function (u, v) {
                return Math.pow(1.16, v) * Math.cos(v) * (1 + Math.cos(u));
            },
            y: function (u, v) {
                return -Math.pow(1.16, v) * Math.sin(v) * (1 + Math.cos(u));
            },
            z: function (u, v) {
                return -2 * Math.pow(1.16, v) * (1 + Math.sin(u));
            }
        }
    }]
};