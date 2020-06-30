
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
    toolbox: {
        left: 20,
        iconStyle: {
            normal: {
                borderColor: '#000'
            }
        },
        feature: {
            myExportObj: {
                title: 'Export OBJ',
                icon: 'M4.7,22.9L29.3,45.5L54.7,23.4M4.6,43.6L4.6,58L53.8,58L53.8,43.6M29.2,45.1L29.2,0',
                onclick: function () {
                    var res = echarts.exportGL2PLY(myChart, {
                        mainType: 'grid3D',
                        index: 0
                    });
                    download(res, 'surface.ply', 'text/plain');
                }
            }
        }
    },
    tooltip: {},
    visualMap: {
        show: false,
        dimension: 2,
        min: -3,
        max: 3,
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
            enable: true,
            SSAO: {
                enable: true,
                radius: 4
            }
        },
        viewControl: {
            distance: 130,
            beta: 50
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
            roughness: 0.3,
            metalness: 0
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