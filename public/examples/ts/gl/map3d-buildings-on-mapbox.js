/*
title: Buildings on Mapbox
category: map3D
titleCN: Buildings on Mapbox
*/

mapboxgl.accessToken = mapboxglToken;

$.getJSON(
  ROOT_PATH + '/data-gl/asset/data/buildings.json',
  function (buildingsGeoJSON) {
    echarts.registerMap('buildings', buildingsGeoJSON);

    var regionsData = buildingsGeoJSON.features.map(function (feature) {
      return {
        name: feature.properties.name,
        value: Math.random(),
        height: +feature.properties.height * 10
      };
    });

    myChart.setOption({
      mapbox: {
        center: [13.409779, 52.520645],
        zoom: 13,
        pitch: 50,
        bearing: -10,
        style: 'mapbox://styles/mapbox/dark-v9',
        postEffect: {
          enable: true,
          SSAO: {
            enable: true,
            intensity: 1.2,
            radius: 10
          },
          screenSpaceReflection: {
            enable: true
          }
        },
        light: {
          main: {
            intensity: 1,
            shadow: false,
            shadowQuality: 'high'
          },
          ambient: {
            intensity: 0
          },
          ambientCubemap: {
            texture: ROOT_PATH + '/data-gl/asset/pisa.hdr',
            exposure: 1,
            diffuseIntensity: 0.5,
            specularIntensity: 2
          }
        }
      },
      series: [
        {
          type: 'map3D',
          coordinateSystem: 'mapbox',
          map: 'buildings',
          data: regionsData,
          shading: 'realistic',
          instancing: true,
          silent: true,
          itemStyle: {
            borderColor: [0, 2, 10],
            borderWidth: 1
          },
          realisticMaterial: {
            metalness: 1,
            roughness: 0.4
          }
        }
      ]
    });
  }
);
