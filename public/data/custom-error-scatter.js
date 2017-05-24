// Prime Costs and Prices for ACME Fashion\nCollection "Spring-Summer, 2016"
// Data from https://playground.anychart.com/gallery/7.12.0/Error_Charts/Marker_Chart
var dimensions = [
    'name', 'Price', 'Prime cost', 'Prime cost min', 'Prime cost max', 'Price min', 'Price max'
];
var data = [
    ['Blouse "Blue Viola"', 101.88, 99.75, 76.75, 116.75, 69.88, 119.88],
    ['Dress "Daisy"', 155.8, 144.03, 126.03, 156.03, 129.8, 188.8],
    ['Trousers "Cutesy Classic"', 203.25, 173.56, 151.56, 187.56, 183.25, 249.25],
    ['Dress "Morning Dew"', 256, 120.5, 98.5, 136.5, 236, 279],
    ['Turtleneck "Dark Chocolate"', 408.89, 294.75, 276.75, 316.75, 385.89, 427.89],
    ['Jumper "Early Spring"', 427.36, 430.24, 407.24, 452.24, 399.36, 461.36],
    ['Breeches "Summer Mood"', 356, 135.5, 123.5, 151.5, 333, 387],
    ['Dress "Mauve Chamomile"', 406, 95.5, 73.5, 111.5, 366, 429],
    ['Dress "Flying Tits"', 527.36, 503.24, 488.24, 525.24, 485.36, 551.36],
    ['Dress "Singing Nightingales"', 587.36, 543.24, 518.24, 555.24, 559.36, 624.36],
    ['Sundress "Cloudy weather"', 603.36, 407.24, 392.24, 419.24, 581.36, 627.36],
    ['Sundress "East motives"', 633.36, 477.24, 445.24, 487.24, 594.36, 652.36],
    ['Sweater "Cold morning"', 517.36, 437.24, 416.24, 454.24, 488.36, 565.36],
    ['Trousers "Lavender Fields"', 443.36, 387.24, 370.24, 413.24, 412.36, 484.36],
    ['Jumper "Coffee with Milk"', 543.36, 307.24, 288.24, 317.24, 509.36, 574.36],
    ['Blouse "Blooming Cactus"', 790.36, 277.24, 254.24, 295.24, 764.36, 818.36],
    ['Sweater "Fluffy Comfort"', 790.34, 678.34, 660.34, 690.34, 762.34, 824.34]
];

function renderItem(params, api) {
    var children = [];
    var coordDims = ['x', 'y'];

    for (var baseDimIdx = 0; baseDimIdx < 2; baseDimIdx++) {
        var otherDimIdx = 1 - baseDimIdx;
        var encode = params.encode;
        var baseValue = api.value(encode[coordDims[baseDimIdx]][0]);
        var param = [];
        param[baseDimIdx] = baseValue;
        param[otherDimIdx] = api.value(encode[coordDims[otherDimIdx]][1]);
        var highPoint = api.coord(param);
        param[otherDimIdx] = api.value(encode[coordDims[otherDimIdx]][2]);
        var lowPoint = api.coord(param);
        var halfWidth = 5;

        var style = api.style({
            stroke: api.visual('color'),
            fill: null
        });

        children.push({
            type: 'line',
            shape: makeShape(
                baseDimIdx,
                highPoint[baseDimIdx] - halfWidth, highPoint[otherDimIdx],
                highPoint[baseDimIdx] + halfWidth, highPoint[otherDimIdx]
            ),
            style: style
        }, {
            type: 'line',
            shape: makeShape(
                baseDimIdx,
                highPoint[baseDimIdx], highPoint[otherDimIdx],
                lowPoint[baseDimIdx], lowPoint[otherDimIdx]
            ),
            style: style
        }, {
            type: 'line',
            shape: makeShape(
                baseDimIdx,
                lowPoint[baseDimIdx] - halfWidth, lowPoint[otherDimIdx],
                lowPoint[baseDimIdx] + halfWidth, lowPoint[otherDimIdx]
            ),
            style: style
        });
    }

    function makeShape(baseDimIdx, base1, value1, base2, value2) {
        var shape = {};
        shape[coordDims[baseDimIdx] + '1'] = base1;
        shape[coordDims[1 - baseDimIdx] + '1'] = value1;
        shape[coordDims[baseDimIdx] + '2'] = base2;
        shape[coordDims[1 - baseDimIdx] + '2'] = value2;
        return shape;
    }

    return {
        type: 'group',
        children: children
    };
}

option = {
    tooltip: {
    },
    legend: {
        data: ['bar', 'error']
    },
    dataZoom: [{
        type: 'slider',
        height: 8,
        bottom: 20,
        borderColor: 'transparent',
        backgroundColor: '#e2e2e2',
        handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
        handleSize: 20,
        handleStyle: {
            shadowBlur: 6,
            shadowOffsetX: 1,
            shadowOffsetY: 2,
            shadowColor: '#aaa'
        }
    }, {
        type: 'inside'
    }],
    grid: {
        bottom: 80
    },
    xAxis: {},
    yAxis: {},
    series: [{
        type: 'scatter',
        name: 'error',
        data: data,
        dimensions: dimensions,
        encode: {
            x: 2,
            y: 1,
            tooltip: [2, 1, 3, 4, 5, 6],
            itemName: 0
        },
        itemStyle: {
            normal: {
                color: '#77bef7'
            }
        }
    }, {
        type: 'custom',
        name: 'error',
        renderItem: renderItem,
        dimensions: dimensions,
        encode: {
            x: [2, 3, 4],
            y: [1, 5, 6],
            tooltip: [2, 1, 3, 4, 5, 6],
            itemName: 0
        },
        data: data,
        z: 100
    }]
};