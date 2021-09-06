/*
title: Globe with Atmosphere
category: globe
titleCN: 大气层显示
*/

option = {
  backgroundColor: '#000',
  globe: {
    baseTexture: ROOT_PATH + '/data-gl/asset/earth.jpg',

    shading: 'lambert',

    environment: ROOT_PATH + '/data-gl/asset/starfield.jpg',

    atmosphere: {
      show: true
    },

    light: {
      ambient: {
        intensity: 0.1
      },
      main: {
        intensity: 1.5
      }
    }
  },
  series: []
};
