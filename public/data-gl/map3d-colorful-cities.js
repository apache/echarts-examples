mapboxgl.accessToken = 'pk.eyJ1IjoicGlzc2FuZyIsImEiOiJjaXBnaGYxcW8wMDFodWNtNDc4NzdqMWR2In0.4XUWeduDltiCbsIiS-U8Lg';

myChart.showLoading();

$.getJSON(ROOT_PATH + '/data-gl/asset/data/buildings.json', function (buildingsGeoJSON) {

    echarts.registerMap('buildings', buildingsGeoJSON);

    myChart.hideLoading();

    var regionsData = buildingsGeoJSON.features.map(function (feature) {
        return {
            name: feature.properties.name,
            value: Math.random(),
            height: +feature.properties.height * 10
        };
    });

    myChart.setOption({
        visualMap: {
            show: false,
            min: 0.4,
            max: 1,
            inRange: {
                color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            }
        },
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
                    intensity: 1.3,
                    radius: 5
                },
                screenSpaceReflection: {
                    enable:false
                },
                depthOfField: {
                    enable: true,
                    blurRadius: 4,
                    focalDistance: 90
                }
            },
            light: {
                main: {
                    intensity: 3,
                    alpha: -40,
                    shadow: true,
                    shadowQuality: 'high'
                },
                ambient: {
                    intensity: 0.
                },
                ambientCubemap: {
                    texture: ROOT_PATH + '/data-gl/asset/pisa.hdr',
                    exposure: 1,
                    diffuseIntensity: 0.5,
                    specularIntensity: 1
                }
            }
        },
        series: [{
            type: 'map3D',
            coordinateSystem: 'mapbox',
            map: 'buildings',
            data: regionsData,
            shading: 'realistic',
            instancing: true,
            silent: true,
            itemStyle: {
                areaColor: '#fff'
            },
            realisticMaterial: {
                metalness: 0,
                roughness: 0.0
            }
        }]
    });


});