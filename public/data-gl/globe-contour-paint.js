
var config = {
    color: '#c0101a',
    levels: 50,
    intensity: 100,
    threshold: 0.01
}

var canvas = document.createElement('canvas');
canvas.width = 4096;
canvas.height = 2048;
context = canvas.getContext("2d");

context.lineWidth = 0.4;
context.strokeStyle = config.color;
context.fillStyle = config.color;
context.shadowColor = config.color;

$.when(
    $.getScript(ROOT_PATH + '/vendors/d3/d3-contour.js'),
    $.getScript(ROOT_PATH + '/vendors/d3/d3-geo.js'),
    $.getScript(ROOT_PATH + '/vendors/d3/d3-timer.js')
).done(function () {

image(ROOT_PATH + '/data-gl/asset/bathymetry_bw_composite_4k.jpg').then(function(image) {
    var m = image.height,
        n = image.width,
        values = new Array(n * m),
        contours = d3.contours().size([n, m]).smooth(true),
        projection = d3.geoIdentity().scale(canvas.width / n),
        path = d3.geoPath(projection, context);

    //   StackBlur.R(image, 5);

    for (var j = 0, k = 0; j < m; ++j) {
        for (var i = 0; i < n; ++i, ++k) {
        values[k] = image.data[(k << 2)] / 255;
        }
    }

    var opt = {
        image: canvas
    }

    var results = [];
    function update(threshold, levels) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        var thresholds = [];
        for (var i = 0; i < levels; i++) {
            thresholds.push((threshold + 1 / levels * i) % 1);
        }
        results = contours.thresholds(thresholds)(values);
        redraw();
    }

    function redraw() {
        results.forEach(function (d, idx) {
            context.beginPath();
            path(d);
            context.globalAlpha = 1;
            context.stroke();
            if (idx > config.levels / 5 * 3) {
                context.globalAlpha = 0.01;
                context.fill();
            }
        });
        onupdate();
    }


    update(config.threshold, config.levels);

    initCharts(opt);

});

function image(url) {
    return new Promise(function(resolve) {
        var image = new Image();
        image.src = url;
        image.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = image.width / 4;
        canvas.height = image.height / 4;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(context.getImageData(0, 0, canvas.width, canvas.height));
        };
    });
}

var contourChart = echarts.init(document.createElement('canvas'), null, {
    width: 4096,
    height: 2048
});

var img = new echarts.graphic.Image({
    style: {
        x: -1,
        y: -1
    }
});

onupdate = function () {
    img.dirty();
}

function initCharts(opt) {
    img.style.width = opt.image.width + 2;
    img.style.height = opt.image.height + 2;
    img.style.image = opt.image;
    contourChart.getZr().add(img);


    myChart.setOption({
        backgroundColor: '#000',
        globe: {

            environment: ROOT_PATH + '/data-gl/asset/starfield.jpg',

            heightTexture: ROOT_PATH + '/data-gl/asset/bathymetry_bw_composite_4k.jpg',

            displacementScale: 0.05,
            displacementQuality: 'high',

            baseColor: '#111',

            shading: 'realistic',
            realisticMaterial: {
                roughness: 0.2,
                metalness: 0
            },

            postEffect: {
                enable: true,
                depthOfField: {
                    // enable: true
                }
            },
            light: {
                ambient: {
                    intensity: 0
                },
                main: {
                    intensity: 0.1,
                    shadow: false
                },
                ambientCubemap: {
                    texture: ROOT_PATH + '/data-gl/asset/lake.hdr',
                    exposure: 1,
                    diffuseIntensity: 0.5,
                    specularIntensity: 2
                }
            },
            viewControl: {
                autoRotate: false
            },

            layers: [{
                type: 'blend',
                blendTo: 'albedo',
                texture: contourChart,
                intensity: 50
            }]
        }
    });
}


});
