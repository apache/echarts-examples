
var sin = Math.sin;
var cos = Math.cos;
var pow = Math.pow;
var sqrt = Math.sqrt;
var cosh = Math.cosh;
var sinh = Math.sinh;
var PI = Math.PI;

var aa = 0.4;
var r = 1 - aa * aa;
var w = sqrt(r);

option = {
    tooltip: {},
    visualMap: {
        show: false,
        dimension: 2,
        min: -5,
        max: 5,
        inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
        }
    },
    xAxis3D: {},
    yAxis3D: {},
    zAxis3D: {},
    grid3D: {
        show: false,
        postEffect: {
            enable: true,
            SSAO: {
                enable: true,
                radius: 4,
                quality: 'high',
                intensity: 1.5
            }
        },
        temporalSuperSampling: {
            enable: true
        },
        light: {
            main: {
                intensity: 2,
                shadow: true
            },
            ambient: {
                intensity: 0
            },
            ambientCubemap: {
                texture: ROOT_PATH + '/data-gl/asset/canyon.hdr',
                exposure: 2,
                diffuseIntensity: 0.2,
                specularIntensity: 3
            }
        }
    },
    series: [{
        type: 'surface',
        parametric: true,
        silent: true,
        wireframe: {
            show: false
        },
        shading: 'realistic',
        realisticMaterial: {
            roughness: 0.2,
            metalness: 1
        },
        parametricEquation: {
            u: {
                min: -13.2,
                max: 13.2,
                step: 0.2
            },
            v: {
                min: -37.4,
                max: 37.4,
                step: 0.2
            },
            x: function (u, v) {
                var denom = aa * (pow(w * cosh(aa * u), 2) + aa * pow(sin(w * v), 2))
                return -u + (2 * r * cosh(aa * u) * sinh(aa * u) / denom);
            },
            y: function (u, v) {
                var denom = aa * (pow(w * cosh(aa * u), 2) + aa * pow(sin(w * v), 2))
                return 2 * w * cosh(aa * u) * (-(w * cos(v) * cos(w * v)) - (sin(v) * sin(w * v))) / denom;
            },
            z: function (u, v) {
                var denom = aa * (pow(w * cosh(aa * u), 2) + aa * pow(sin(w * v), 2))
                return  2 * w * cosh(aa * u) * (-(w * sin(v) * cos(w * v)) + (cos(v) * sin(w * v))) / denom
            }
        }
    }]
};