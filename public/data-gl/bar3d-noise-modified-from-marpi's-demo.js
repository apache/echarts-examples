var simplex = new SimplexNoise();

window.onresize = myChart.resize;

var UPDATE_DURATION = 1000;

function initVisualizer() {

    var config = {
        numWaves: 2,
        randomize: randomize,
        color1: '#000',
        color2: "#300",
        color3: "#fff",
        size: 150,
        roughness: 0.5,
        metalness: 0.
    };

    gui = new dat.GUI();
    //gui.add(config, "numWaves", 1, 3).name("Waves number").onChange(update).listen();
    for (var i = 0; i < 2; i++) {
        config["wave" + i + "axis" + "x"] = Math.random();
        config["wave" + i + "axis" + "y"] = Math.random();
        config["wave" + i + "rounding"] = Math.random();
        config["wave" + i + "square"] = Math.random();
        gui.add(config, "wave" + i + "axis" + "x", 0, 1).name("Wave " + (i + 1) + " width").onChange(update);
        gui.add(config, "wave" + i + "axis" + "y", 0, 1).name("Wave " + (i + 1) + " depth").onChange(update);
        gui.add(config, "wave" + i + "rounding", 0, 1).name("Wave " + (i + 1) + " grow").onChange(update);
        gui.add(config, "wave" + i + "square", 0, 1).name("Wave " + (i + 1) + " square").onChange(update);
    }
    gui.addColor(config, 'color1').onChange(update);
    gui.addColor(config, 'color2').onChange(update);
    gui.addColor(config, 'color3').onChange(update);
    gui.add(config, 'roughness', 0, 1).onChange(update);
    gui.add(config, 'metalness', 0, 1).onChange(update);

    gui.add(config, "randomize").name("Randomize")

    function randomize() {
        //config.numWaves = Math.floor(Math.random() * 3) + 1;
        for (var i = 0; i < 2; i++) {
            config["wave" + i + "axis" + "x"] = Math.random();
            config["wave" + i + "axis" + "y"] = Math.random();
            config["wave" + i + "rounding"] = Math.random();
            config["wave" + i + "square"] = Math.random();
        }

        // Iterate over all controllers
        for (var i in gui.__controllers) {
            gui.__controllers[i].updateDisplay();
        }
        update();
    }

    function update() {
        var item = [];
        var dataProvider = [];

        var mod = .1

        //config.numWaves = Math.round(config.numWaves)

        //var occurenceR = Math.random() * .02
        //var r = 0//Math.random()
        for (var s = 0; s < config.size * config.size; s++) {
            var x = s % config.size;
            var y = Math.floor(s / config.size);

            //if (Math.random() < occurenceR)
            //    r = Math.random()

            var output = 0;
            for (var i = 0; i < config.numWaves; i++) {
                var n = simplex.noise2D(i * 213 + (-50 + x) * mod * (1 - config["wave" + i + "axis" + "x"]) * .5, i * 3124 + (-50 + y) * mod * (1 - config["wave" + i + "axis" + "y"]) * .5)
                n = Math.pow(n, 1.95 - 1.9 * config["wave" + i + "rounding"])
                var square = Math.floor((1.1 - config["wave" + i + "square"]) * 100)
                n = Math.round(n * square) / square
                    //output*=n
                if (output < n)
                    output = n;
            }
            dataProvider.push([x, y, (output + .1) * 2]);
        }


        myChart.setOption({
            visualMap: {
                inRange: {
                    barSize: 100 / config.size,
                    color: [config.color1, config.color2, config.color3],
                }
            },
            series: [{
                data: dataProvider,
                realisticMaterial: {
                    roughness: config.roughness,
                    metalness: config.metalness
                }
            }]
        });
        //setTimeout(update, UPDATE_DURATION);
    }

    update();
}
var focalRange = 40
var blurRadius = 4

option = {
    toolbox: {
        left: 20,
        iconStyle: {
            normal: {
                borderColor: '#fff'
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
                    download(res, 'bar3D.ply', 'text/plain');
                }
            }
        }
    },
    tooltip: {},
    visualMap: {
        show: false,
        min: 0.1,
        max: 2.5,
        inRange: {
            color: ['#000', '#300', '#fff']
        }
    },
    xAxis3D: {
        type: 'value'
    },
    yAxis3D: {
        type: 'value'
    },
    zAxis3D: {
        type: 'value',
        min: -6,
        max: 6
    },
    grid3D: {
        show: false,
        environment: '#000',
        viewControl: {
            distance: 100,
            maxDistance: 150,
            minDistance: 50,
            alpha: 38,
            beta: 220,
            minAlpha: 10,
            //maxBeta: 360,
        },
        postEffect: {
            enable: true,
            SSAO: {
                enable: true,
                intensity: 1.3,
                radius: 5
            },
            screenSpaceReflection: {
                enable: true
            },
            depthOfField: {
                enable: true,
                blurRadius: blurRadius,
                focalRange: focalRange,
                focalDistance: 70
            }
        },
        light: {
            main: {
                intensity: 1,
                shadow: true,
                shadowQuality: 'high',
                alpha: 30
            },
            ambient: {
                intensity: 0
            },
            ambientCubemap: {
                texture: '/asset/get/s/data-1491838644249-ry33I7YTe.hdr',
                exposure: 2,
                diffuseIntensity: 1,
                specularIntensity: 1
            }
        }
    },
    series: [{
        type: 'bar3D',
        silent: true,
        shading: 'realistic',
        realisticMaterial: {
            roughness: 0.5,
            metalness: 0
        },
        instancing: true,
        barSize: 0.6,
        data: [],
        lineStyle: {
            width: 4
        },
        itemStyle: {
            color: "#fff"
        },
        animation: false,
        animationDurationUpdate: UPDATE_DURATION
    }]
};

setTimeout(function() {
    initVisualizer();
})