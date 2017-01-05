var rocket = 'path://M-244.396,44.399c0,0,0.47-2.931-2.427-6.512c2.819-8.221,3.21-15.709,3.21-15.709s5.795,1.383,5.795,7.325C-237.818,39.679-244.396,44.399-244.396,44.399z M-260.371,40.827c0,0-3.881-12.946-3.881-18.319c0-2.416,0.262-4.566,0.669-6.517h17.684c0.411,1.952,0.675,4.104,0.675,6.519c0,5.291-3.87,18.317-3.87,18.317H-260.371z M-254.745,18.951c-1.99,0-3.603,1.676-3.603,3.744c0,2.068,1.612,3.744,3.603,3.744c1.988,0,3.602-1.676,3.602-3.744S-252.757,18.951-254.745,18.951z M-255.521,2.228v-5.098h1.402v4.969c1.603,1.213,5.941,5.069,7.901,12.5h-17.05C-261.373,7.373-257.245,3.558-255.521,2.228zM-265.07,44.399c0,0-6.577-4.721-6.577-14.896c0-5.942,5.794-7.325,5.794-7.325s0.393,7.488,3.211,15.708C-265.539,41.469-265.07,44.399-265.07,44.399z M-252.36,45.15l-1.176-1.22L-254.789,48l-1.487-4.069l-1.019,2.116l-1.488-3.826h8.067L-252.36,45.15z';

option = {
    color: ['#bb0004', '#FFD48A'],
    legend: {
        data: ['pictorial element', 'reference bar']
    },
    xAxis: {
        data: ['a', 'b', 'c', 'd'],
        axisTick: {
            show: false
        },
        axisLabel: {
            interval: 0
        }
    },
    yAxis: {
        max: 80,
        splitLine: {show: false}
    },
    grid: {
        left: 40,
        right: 10
    },
    series: [{
        type: 'pictorialBar',
        name: 'pictorial element',
        symbol: rocket,
        z: 10,
        data: [{
            value: 60,
            symbolSize: [
                '50%', // 50% of the width of reference bar.
                '100%' // 100% of the height of reference bar.
            ]
        }, {
            value: 60,
            symbolSize: [
                '50%', // 50% of the width of reference bar.
                120    // Fixed height value.
            ]
        }, {
            value: 60,
            symbolSize: 50 // Equivalent to [50, 50]
        }, {
            value: 60,
            symbolRepeat: true,
            symbolSize: '70%' // Equivalent to ['70%', '70%']
                              // And both width and height percentage are calculated based
                              // on the width of reference bar when symbolRepeat used.
        }]
    }, {
        type: 'bar',
        name: 'reference bar',
        barGap: '-100%',
        data: [60, 60, 60, 60]
    }]
};


// Add descriptions.
function addDescriptions() {
    var descriptions = [
        [
            'symbolSize: ["50%", "100%"]',
            'That is:',
            '50% of reference bar width',
            '100% of reference bar height.'
        ],
        [
            'symbolSize: ["50%", 120]',
            'That is:',
            '50% of reference bar width,',
            'fixed height 120.'
        ],
        [
            'symbolSize: 50',
            'equivalent to [50, 50]'
        ],
        [
            'symbolSize: "70%"',
            'equivalent to ["70%", "70%"]',
            '',
            'When symbolRepeat used, both',
            'width and height percentage are',
            'calculated based on the width of',
            'reference bar.'
        ]
    ];

    myChart.setOption({
        graphic: echarts.util.map(option.xAxis.data, function (itemName, index) {
            return {
                type: 'group',
                position: myChart.convertToPixel('grid', [index, 70]),
                children: [{
                    type: 'text',
                    left: 'center',
                    top: 'middle',
                    style: {
                        text: descriptions[index].join('\n'),
                        fill: '#bb0004'
                    },
                    z: 101
                }]
            };
        })
    }, {silent: true});
}

setTimeout(function () {
    addDescriptions();
    myChart.on('updated', addDescriptions);
}, 100);
