var upColor = '#ec0000';
var upBorderColor = '#8A0000';
var downColor = '#00da3c';
var downBorderColor = '#008F28';

var dataCount = 2e5;
var data = generateOHLC(dataCount);

var option = {
    dataset: {
        source: data
    },
    title: {
        text: 'Data Amount: ' + echarts.format.addCommas(dataCount)
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'line'
        }
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: false
            },
        }
    },
    grid: [
        {
            left: '10%',
            right: '10%',
            bottom: 200
        },
        {
            left: '10%',
            right: '10%',
            height: 80,
            bottom: 80
        }
    ],
    xAxis: [
        {
            type: 'category',
            scale: true,
            boundaryGap: false,
            // inverse: true,
            axisLine: {onZero: false},
            splitLine: {show: false},
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax'
        },
        {
            type: 'category',
            gridIndex: 1,
            scale: true,
            boundaryGap: false,
            axisLine: {onZero: false},
            axisTick: {show: false},
            splitLine: {show: false},
            axisLabel: {show: false},
            splitNumber: 20,
            min: 'dataMin',
            max: 'dataMax'
        }
    ],
    yAxis: [
        {
            scale: true,
            splitArea: {
                show: true
            }
        },
        {
            scale: true,
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: {show: false},
            axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false}
        }
    ],
    dataZoom: [
        {
            type: 'inside',
            xAxisIndex: [0, 1],
            start: 10,
            end: 100
        },
        {
            show: true,
            xAxisIndex: [0, 1],
            type: 'slider',
            bottom: 10,
            start: 10,
            end: 100,
            handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '105%'
        }
    ],
    visualMap: {
        show: false,
        seriesIndex: 1,
        dimension: 6,
        pieces: [{
            value: 1,
            color: upColor
        }, {
            value: -1,
            color: downColor
        }]
    },
    series: [
        {
            type: 'candlestick',
            itemStyle: {
                color: upColor,
                color0: downColor,
                borderColor: upBorderColor,
                borderColor0: downBorderColor
            },
            encode: {
                x: 0,
                y: [1, 4, 3, 2]
            }
        },
        {
            name: 'Volumn',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            itemStyle: {
                color: '#7fbe9e'
            },
            large: true,
            encode: {
                x: 0,
                y: 5
            }
        }
    ]
};

function generateOHLC(count) {
    var data = [];

    var xValue = +new Date(2011, 0, 1);
    var minute = 60 * 1000;
    var baseValue = Math.random() * 12000;
    var boxVals = new Array(4);
    var dayRange = 12;

    for (var i = 0; i < count; i++) {
        baseValue = baseValue + Math.random() * 20 - 10;

        for (var j = 0; j < 4; j++) {
            boxVals[j] = (Math.random() - 0.5) * dayRange + baseValue;
        }
        boxVals.sort();

        var openIdx = Math.round(Math.random() * 3);
        var closeIdx = Math.round(Math.random() * 2);
        if (closeIdx === openIdx) {
            closeIdx++;
        }
        var volumn = boxVals[3] * (1000 + Math.random() * 500);

        // ['open', 'close', 'lowest', 'highest', 'volumn']
        // [1, 4, 3, 2]
        data[i] = [
            echarts.format.formatTime('yyyy-MM-dd\nhh:mm:ss', xValue += minute),
            +boxVals[openIdx].toFixed(2), // open
            +boxVals[3].toFixed(2), // highest
            +boxVals[0].toFixed(2), // lowest
            +boxVals[closeIdx].toFixed(2),  // close
            volumn.toFixed(0),
            getSign(data, i, +boxVals[openIdx], +boxVals[closeIdx], 4) // sign
        ];
    }

    return data;

    function getSign(data, dataIndex, openVal, closeVal, closeDimIdx) {
        var sign;
        if (openVal > closeVal) {
            sign = -1;
        }
        else if (openVal < closeVal) {
            sign = 1;
        }
        else {
            sign = dataIndex > 0
                // If close === open, compare with close of last record
                ? (data[dataIndex - 1][closeDimIdx] <= closeVal ? 1 : -1)
                // No record of previous, set to be positive
                : 1;
        }

        return sign;
    }
}
