var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

var imgData;
var currentImg;

// Configurations
var config = {
    scale: 0.3,
    roughness: 0,
    metalness: 1,
    projection: "orthographic",
    depthOfField: 4,
    lockY: false,
    move: true,
    sameColor: false,
    color: '#777',
    colorContrast: 1.2,
    lightIntensity: 1,
    lightColor: '#fff',
    lightRotate: 30,
    lightPitch: 40,
    AO: 1.5,
    showEnvironment: false,
    
    barNumber: 80,
    barBevel: 0.18,
    barSize: 1.2
};

option = {
    tooltip: {},
    backgroundColor: "#000",
    xAxis3D: {
        type: "value"
    },
    yAxis3D: {
        type: "value"
    },
    zAxis3D: {
        type: "value",
        min: 0,
        max: 100
    },
    grid3D: {
        show: false,
        viewControl: {
            projection: "perspective",
            alpha: 45,
            beta: -45,
            panSensitivity: config.move ? 1 : 0,
            rotateSensitivity: config.lockY ? [1, 0] : 1,
            damping: 0.9,
            distance: 60
        },
        postEffect: {
            enable: true,
            bloom: {
                intensity: 0.2
            },
            screenSpaceAmbientOcclusion: {
                enable: true,
                intensity: 1.5,
                radius: 5,
                quality: "high"
            },
            screenSpaceReflection: {
                enable: true
            },
            depthOfField: {
                enable: true,
                blurRadius: config.depthOfField,
                fstop: 10,
                focalDistance: 55
            }
        },
        boxDepth: 100,
        boxHeight: 20,
        environment: "none",
        light: {
            main: {
                shadow: true,
                intensity: 2
            },
            ambientCubemap: {
                texture: '/asset/get/s/data-1491838644249-ry33I7YTe.hdr',
                exposure: 2,
                diffuseIntensity: 0.2,
                specularIntensity: 1.5
            }
        }
    }
};

function updateData(data, width, height) {
    console.time("update");
    var dataItem = [];
    var dataProvider = {
        getItem: function(i) {
            var r = data[i * 4];
            var g = data[i * 4 + 1];
            var b = data[i * 4 + 2];

            var lum = 0.2125 * r + 0.7154 * g + 0.0721 * b;
            lum = (lum - 125) * config.scale + 50;
            dataItem[0] = i % width;
            dataItem[1] = height - Math.floor(i / width);
            dataItem[2] = lum;
            return dataItem;
        },
        count: function() {
            return data.length / 4;
        }
    };

    myChart.setOption({
        grid3D: {
            boxWidth: 100 / height * width
        },
        series: [{
            animation: false,
            type: "bar3D",
            shading: "realistic",
            realisticMaterial: {
                roughness: config.roughness,
                metalness: config.metalness
            },
            barSize: config.barSize,
            bevelSize: config.barBevel,
            silent: true,
            itemStyle: {
                color: config.sameColor ? config.color : function(params) {
                    var i = params.dataIndex;
                    var r = data[i * 4] / 255;
                    var g = data[i * 4 + 1] / 255;
                    var b = data[i * 4 + 2] / 255;
                    var lum = 0.2125 * r + 0.7154 * g + 0.0721 * b;
                    r *= lum * config.colorContrast;
                    g *= lum * config.colorContrast;
                    b *= lum * config.colorContrast;
                    return [r, g, b, 1];
                }
            },
            data: dataProvider
        }]
    });

    console.timeEnd("update");

    setTimeout(function() {
        myChart.getZr().refresh()
    }, 100);
}

function loadImage(img) {
    var height = (canvas.height = Math.min(config.barNumber, img.height));
    var aspect = img.width / img.height;
    var width = (canvas.width = Math.round(height * aspect));

    ctx.drawImage(img, 0, 0, width, height);

    imgData = ctx.getImageData(0, 0, width, height);

    updateData(imgData.data, width, height);
}

var gui = new dat.GUI();

function updateDataWhenChange() {
    if (imgData) {
        updateData(imgData.data, imgData.width, imgData.height);
    }
}
gui.add(config, "scale", -1, 1).onFinishChange(updateDataWhenChange);
gui.add(config, "colorContrast", 0, 2).onFinishChange(updateDataWhenChange);
gui.add(config, 'sameColor').onChange(updateDataWhenChange);
gui.addColor(config, 'color').onChange(updateDataWhenChange);

["roughness", "metalness"].forEach(function(propName) {
    gui.add(config, propName, 0, 1).step(0.01).onFinishChange(function() {
        myChart.setOption({
            series: [{
                realisticMaterial: {
                    roughness: config.roughness,
                    metalness: config.metalness
                }
            }]
        });
    });
});

function updateControlAndLight() {
    myChart.setOption({
        grid3D: {
            environment: config.showEnvironment ? 'auto' : '#000',
            viewControl: {
                panSensitivity: config.move ? 1 : 0,
                rotateSensitivity: config.lockY ? [1, 0] : 1
            },
            light: {
                main: {
                    intensity: config.lightIntensity,
                    color: config.lightColor,
                    alpha: config.lightPitch,
                    beta: config.lightRotate
                },
                ambientCubemap: {
                    texture: '/asset/get/s/data-1491838644249-ry33I7YTe.hdr'
                }
            },
            postEffect: {
                screenSpaceAmbientOcclusion: {
                    intensity: config.AO
                }
            }
        }
    });
}

gui.add(config, 'lightIntensity', 0, 10).onChange(updateControlAndLight);
gui.add(config, 'lightRotate', -180, 180).onChange(updateControlAndLight);
gui.add(config, 'lightPitch', 10, 90).onChange(updateControlAndLight);
// gui.add(config, 'AO', 0, 2).onChange(updateControlAndLight);
// gui.addColor(config, 'lightColor').onChange(updateControlAndLight);

// FIXME Not work
// gui.add(config, 'showEnvironment').onChange(updateControlAndLight);
// gui.add(config, 'environment', ['canyon', 'pisa']).onChange(updateControlAndLight);

// gui.add(config, 'move').onChange(updateControlAndLight);
// gui.add(config, 'lockY').onChange(updateControlAndLight);

gui.add(config, 'barNumber', 0, 256).onFinishChange(function () {
    loadImage(currentImg);
});
gui.add(config, 'barSize', 0, 2).onFinishChange(function () {
    myChart.setOption({
        series: [{
            barSize: config.barSize
        }]
    })
});
gui.add(config, 'barBevel', 0, 1).onFinishChange(function () {
    myChart.setOption({
        series: [{
            bevelSize: config.barBevel
        }]
    })
});
gui.add(config, 'depthOfField', 0., 10).onFinishChange(function () {
    myChart.setOption({
        grid3D: {
            postEffect: {
                depthOfField: {
                    blurRadius: config.depthOfField
                }
            },
        }
    }) 
});


// Handle file uploads.
function readFile(file) {
    if (!file || !file.type.match(/image/)) {
        return;
    }

    var fileReader = new FileReader();
    fileReader.onload = function(e) {
        img = new Image();
        img.onload = function() {
            loadImage(img);
            currentImg = img;
        };
        img.src = e.target.result;
    };
    fileReader.readAsDataURL(file);
}

$('<div id="image-upload">Drop files here or click to upload</div>').appendTo(
    $('#chart-panel')
).css({
  width: '300px',
  height: '100px',
  'line-height': '100px',
  'text-align': 'center',
  cursor: 'pointer',
  background: 'rgba(255, 255, 255, 0.2)',
  'border-radius': '4px',
  border: '2px dashed #999',
  position: 'absolute',
  right: '10px',
  bottom: '10px',
  'z-index': '10',
  color: '#fff'
})

$("#image-upload").on("dragover", function(e) {
    e.stopPropagation();
    e.preventDefault();
});
$("#image-upload")[0].addEventListener("drop", function(e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files;
    return readFile(files[0]);
});
$("#image-upload").on("click", function() {
    var $file = $('<input type="file" />');
    $file.on("change", function(e) {
        readFile(e.target.files[0]);
    });
    $file.click();
});

// Default
var img = new Image();
img.onload = function() {
    loadImage(img);
    currentImg = img;
};
img.src = "/asset/get/s/data-1502210091353-S1mNuDPDW.png";