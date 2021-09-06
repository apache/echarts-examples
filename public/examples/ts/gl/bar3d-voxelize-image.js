/*
title: Voxelize image
category: bar3D
titleCN: Voxelize image
*/

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');

var imgData;
var currentImg;

// Configurations
var config = {
  scale: 0.3,
  roughness: 0,
  metalness: 1,
  projection: 'orthographic',
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
  backgroundColor: '#000',
  xAxis3D: {
    type: 'value'
  },
  yAxis3D: {
    type: 'value'
  },
  zAxis3D: {
    type: 'value',
    min: 0,
    max: 100
  },
  grid3D: {
    show: false,
    viewControl: {
      projection: 'perspective',
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
        quality: 'high'
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
    environment: 'none',
    light: {
      main: {
        shadow: true,
        intensity: 2
      },
      ambientCubemap: {
        texture: ROOT_PATH + '/data-gl/asset/pisa.hdr',
        exposure: 2,
        diffuseIntensity: 0.2,
        specularIntensity: 1.5
      }
    }
  }
};

function updateData(pixelData, width, height) {
  console.time('update');
  var data = new Float32Array((pixelData.length / 4) * 3);
  var off = 0;
  for (var i = 0; i < pixelData.length / 4; i++) {
    var r = pixelData[i * 4];
    var g = pixelData[i * 4 + 1];
    var b = pixelData[i * 4 + 2];

    var lum = 0.2125 * r + 0.7154 * g + 0.0721 * b;
    lum = (lum - 125) * config.scale + 50;
    data[off++] = i % width;
    data[off++] = height - Math.floor(i / width);
    data[off++] = lum;
  }

  myChart.setOption({
    grid3D: {
      boxWidth: (100 / height) * width
    },
    series: [
      {
        animation: false,
        type: 'bar3D',
        shading: 'realistic',
        realisticMaterial: {
          roughness: config.roughness,
          metalness: config.metalness
        },
        barSize: config.barSize,
        bevelSize: config.barBevel,
        silent: true,
        dimensions: ['x', 'y', 'z'],
        itemStyle: {
          color: config.sameColor
            ? config.color
            : function (params) {
                var i = params.dataIndex;
                var r = pixelData[i * 4] / 255;
                var g = pixelData[i * 4 + 1] / 255;
                var b = pixelData[i * 4 + 2] / 255;
                var lum = 0.2125 * r + 0.7154 * g + 0.0721 * b;
                r *= lum * config.colorContrast;
                g *= lum * config.colorContrast;
                b *= lum * config.colorContrast;
                return [r, g, b, 1];
              }
        },
        data: data
      }
    ]
  });

  console.timeEnd('update');
}

function loadImage(img) {
  var height = (canvas.height = Math.min(config.barNumber, img.height));
  var aspect = img.width / img.height;
  var width = (canvas.width = Math.round(height * aspect));

  ctx.drawImage(img, 0, 0, width, height);

  imgData = ctx.getImageData(0, 0, width, height);

  updateData(imgData.data, width, height);
}

// Default
var img = new Image();
img.onload = function () {
  loadImage(img);
  currentImg = img;
};
img.src = ROOT_PATH + '/data-gl/asset/bitcoin.png';
