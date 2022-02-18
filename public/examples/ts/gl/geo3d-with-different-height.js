/*
title: Geo3D with Different Height
category: geo3D
titleCN: Geo3D with Different Height
*/

$.getJSON(
  ROOT_PATH + '/data-gl/asset/data/world-population.json',
  function (populationData) {
    var max = -Infinity;
    var min = Infinity;
    populationData.forEach(function (item) {
      max = Math.max(Math.log(item.value), max);
      min = Math.min(Math.log(item.value), min);
    });

    var regions = populationData.map(function (item) {
      return {
        name: item.name,
        height: ((Math.log(item.value) - min) / (max - min)) * 3
      };
    });

    myChart.setOption(
      (option = {
        backgroundColor: '#cdcfd5',
        geo3D: {
          map: 'world',
          shading: 'lambert',

          lambertMaterial: {
            detailTexture: ROOT_PATH + '/data-gl/asset/woods.jpg',
            textureTiling: 20
          },

          postEffect: {
            enable: true,
            SSAO: {
              enable: true,
              radius: 3,
              quality: 'high'
            }
          },
          groundPlane: {
            show: true
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
              texture: ROOT_PATH + '/data-gl/asset/canyon.hdr',
              exposure: 2,
              diffuseIntensity: 0.3
            }
          },
          viewControl: {
            distance: 50
          },

          regionHeight: 0.5,

          regions: regions
        }
      })
    );
  }
);
