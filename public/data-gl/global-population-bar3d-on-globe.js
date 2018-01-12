$.getJSON("/asset/get/s/data-1491887968120-rJODPy9ae.json", function (data) {
    
    data = data.filter(function (dataItem) {
        return dataItem[2] > 0;
    }).map(function (dataItem) {
        return [dataItem[0], dataItem[1], Math.sqrt(dataItem[2])];
    });
    
    option = {
        backgroundColor: '#000',
        globe: {
            baseTexture: "/asset/get/s/data-1491837049070-rJZtl7Y6x.jpg",
            heightTexture: "/asset/get/s/data-1491837049070-rJZtl7Y6x.jpg",
            shading: 'lambert',
            environment: '/asset/get/s/data-1491837999815-H1_44Qtal.jpg',
            light: {
                main: {
                    intensity: 2
                }
            },
            viewControl: {
                autoRotate: false
            }
        },
        visualMap: {
            max: 40,
            calculable: true,
            realtime: false,
            inRange: {
                colorLightness: [0.2, 0.9]
            },
            textStyle: {
                color: '#fff'
            },
            controller: {
                inRange: {
                    color: 'orange'  
                }
            },
            outOfRange: {
                colorAlpha: 0
            }
        },
        series: [{
            type: 'bar3D',
            coordinateSystem: 'globe',
            data: data,
            barSize: 0.6,
            minHeight: 0.2,
            silent: true,
            itemStyle: {
                color: 'orange'
            }
        }]
    };
    
    myChart.setOption(option);
})