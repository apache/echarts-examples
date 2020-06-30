$.getScript(ROOT_PATH + '/vendors/simplex.js').done(function () {


var noise = new SimplexNoise(Math.random);
function generateData(theta, min, max) {
    var data = [];
    for (var i = 0; i <= 50; i++) {
        for (var j = 0; j <= 50; j++) {
            var value = noise.noise2D(i / 20, j / 20);
            valMax = Math.max(valMax, value);
            valMin = Math.min(valMin, value);
            data.push([i, j, value * 2 + 4]);
        }
    }
    return data;
}
var valMin = Infinity;
var valMax = -Infinity;
var data = generateData(2, -5, 5);
console.log(valMin, valMax);

myChart.setOption(option = {
    visualMap: {
        show: false,
        min: 2,
        max: 6,
        inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
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
        max: 10,
        min: 0
    },
    grid3D: {
        axisLine: {
            lineStyle: { color: '#fff' }
        },
        axisPointer: {
            lineStyle: { color: '#fff' }
        },
        viewControl: {
            // autoRotate: true
        },
        light: {
            main: {
                shadow: true,
                quality: 'ultra',
                intensity: 1.5
            }
        }
    },
    series: [{
        type: 'bar3D',
        data: data,
        shading: 'lambert',
        label: {
            formatter: function (param) {
                return param.value[2].toFixed(1);
            }
        }
    }]
});

});